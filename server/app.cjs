//imports
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cookieParser = require("cookie-parser");


//initialize
const Admin = require("./models/Admin.cjs");
const Club = require("./models/clubs.cjs");
const Faculty = require("./models/faculty.cjs");
const Student = require("./models/students.cjs");
const User = require("./models/User.cjs");

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};


//middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


//functions
function checkEmail(email) {
    if (email.includes('@')) {
        let arr = email.split('@');
        if (arr[arr.length - 1] == "gmail.com") {
            return true;
        }
    }
    return false;
}

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/CIMP');
    console.log("Database Connected !");
}

app.listen(PORT, (req, res) => {
    console.log("Server is listening to " + PORT);
});


app.get("/getData", (req, res) => {
    console.log("Database hitted");
    res.json({ message: "Hello From Backend !! " });
});


// SignUp Route.
app.post("/signUp", async (req, res) => {
    const { Name, Email, Password, Role, id } = req.body;
    let userRes = await User.find({ email: Email, id: id });
    if (!userRes.length) {
        try {
            console.log(req.body);
            let hashPass = "";
            let emailValidation = checkEmail(Email);
            console.log(emailValidation);
            if (emailValidation == true) {
                hashPass = await bcrypt.hash(Password, saltRounds);   //Encryption of the password.
                /// yet to be done
                const user1 = new User({
                    name: Name,
                    email: Email,
                    password: hashPass,
                    role: Role,
                    id: id //either regNo or faculty_id or Admin_id
                });
                await user1.save();

                //cookies
                res.cookie("login", "true", { secure: false });
                res.cookie("id", id, { secure: false });
                // res.cookie("name", Name, { secure: false });  // secure false as using http. not https.
                if (Role === "faculty") {
                    const faculty1 = new Faculty({
                        userId: user1._id
                    });
                    faculty1.save();
                }
                else if (Role === "president") {
                    const student1 = new Student({
                        userId: user1._id
                    });
                    student1.save();
                } else if (Role === "admin") {
                    const admin1 = new Admin({
                        userId: user1._id
                    })
                    admin1.save();
                }
                console.log("User Signed Up!!");
                flag = 1;
                res.status(200).json({ 'message': "User saved successfully", "flag": "success" });
            } else {
                res.json({ 'message': 'Email is Invalid ! ', "flag": "error" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ 'message': "Error in pushing the data. ", "flag": "error" });
        }
    } else {
        res.json({ 'message': 'User already exists ! ', flag: "error" });
    }
});



//login route.
app.post("/login", async (req, res) => {
    // let flag = 0;
    const { Email, Password } = req.body;
    let userRes = await User.find({ email: Email });
    if (userRes.length) {
        let hashPass = userRes[0].password;
        bcrypt.compare(Password, hashPass, function (err, result) {
            if (result) {
                flag = 1;
                res.cookie("login", "true", { secure: false });
                res.cookie("id", userRes[0].id, { secure: false });
                res.json({ "message": "User Logged in Successfully", "flag": "success", role: userRes[0].role });
            } else {
                res.json({ "message": "Password is incorrect ! ", "flag": "error" });
            }
        });
    } else {
        res.json({ "message": "Email is incorrect ! ", "flag": "error" });
    }
});



//creating a new Club 
app.post("/createNewClub", async (req, res) => {
    //  name: '', president: '', facultyCoordinator: '', maxMemberCount: '',
    //     category: '', status: 'Active'
    let { name, president, facultyCoordinator, maxMemberCount, category, status } = req.body;
    console.log(req.body);
    try {
        let clubDetails = await Club.find({ clubName: name });
        let facultyDetails = await User.find({ id: facultyCoordinator, role: "faculty" });
        let studentDetails = await User.find({ id: president, role: "president" });
        console.log("faculty_details_: " + facultyDetails);
        console.log("Student _detils:  " + studentDetails);
        //also check for the faculty and president already present in the database or not.
        if (!clubDetails.length) {
            if (facultyDetails.length) {
                if (studentDetails.length) {
                    let newClub_ = new Club({
                        name: name,
                        president: president,
                        category: category,
                        faculty: facultyCoordinator,
                        status: status,
                        maxMembers: maxMemberCount,
                        members:[{regNo:president,name:studentDetails[0].name}]
                    });
                    newClub_.save();
                    console.log("ClUb created is: ");
                    console.log(newClub_);
                    res.json({ message: "Club Created Successfully", flag: "success" ,presidentName:studentDetails[0].name,facultyName:facultyDetails[0].name});
                } else {
                    res.json({ message: "President Not Found", flag: "error" });
                }
            } else {
                res.json({ message: "Faculty Not Found", flag: "error" });
            }
        } else {
            res.json({ message: "Club Already Exists", flag: "error" });
        }
    } catch (err) {
        res.json({ message: err.message, flag: "error" });
    }
});



//get club Data.
app.get("/getClubData", async (req, res) => {
    try {
        const clubData = await Club.find();
        let data=[];
        for (let index = 0; index < clubData.length; index++) {
            const element = clubData[index];
            //Find the name of the president and faculty
            let facultyDetails = await User.find({ id: element.faculty, role: "faculty" });
            let studentDetails = await User.find({ id: element.president, role: "president" });
            data.push({_id:element._id,name:element.name.trim(),president:studentDetails[0].name,faculty:facultyDetails[0].name,members:element.members,maxMemberCount:element.maxMembers,category:element.category,status:element.status})
        }
        res.json(data);
    } catch (err) {
        res.json({ message: err.msg, flag: "error" });
    }
})


//sending member details.
app.get("/getMembers",(req,res)=>{
    try{

    } catch(err){
        res.json({message:err.message,flag:"error"});
    }
})



//logging out.
app.get("/logout", async (req, res) => {
    res.cookie("login", "false", { secure: false });
    res.json({ message: "Logged Out Sucessfully", "flag": "success" });
});