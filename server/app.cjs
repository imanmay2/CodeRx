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
const Request = require("./models/Request.cjs");

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
                        members: [{ regNo: president, name: studentDetails[0].name }]
                    });
                    newClub_.save();
                    console.log("Club created is: ");
                    console.log(newClub_);
                    res.json({ message: "Club Created Successfully", flag: "success", presidentName: studentDetails[0].name, facultyName: facultyDetails[0].name });
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
        let data = [];
        for (let index = 0; index < clubData.length; index++) {
            const element = clubData[index];
            //Find the name of the president and faculty
            let facultyDetails = await User.find({ id: element.faculty, role: "faculty" });
            let studentDetails = await User.find({ id: element.president, role: "president" });
            data.push({ _id: element._id, name: element.name.trim(), presidentId: element.president, presidentEmail: studentDetails[0].email, president: studentDetails[0].name, facultyId: element.faculty, faculty: facultyDetails[0].name, members: element.members, maxMemberCount: element.maxMembers, category: element.category, status: element.status })
        }
        res.json(data);
    } catch (err) {
        res.json({ message: err.msg, flag: "error" });
    }
})


//sending member details.
app.get("/getMembers/:president_id", async (req, res) => {
    try {
        const { president_id } = req.params;
        const clubMembers = await Club.find({ president: president_id });
        console.log(clubMembers[1]);
        res.json({ data_: [...clubMembers[1].members], flag: "success", faculty_id: clubMembers[0].faculty, clubName: clubMembers[0].name });
    } catch (err) {
        res.json({ message: err.message, flag: "error" });
    }
});


app.get("/getInfo/:president_id/:faculty_id", async (req, res) => {
    try {
        const { president_id, faculty_id } = req.params;
        let facultyDetails = await User.find({ id: faculty_id, role: "faculty" });
        let studentDetails = await User.find({ id: president_id, role: "president" });
        console.log(req.params);

        let obj1 = { _id: facultyDetails[0]._id, regNo: faculty_id, name: facultyDetails[0].name, role: "Faculty", email: facultyDetails[0].email };
        let obj2 = { _id: studentDetails[0]._id, regNo: president_id, name: studentDetails[0].name, role: "President", email: studentDetails[0].email };
        res.json({ data_: [obj1, obj2], flag: "success" });
    } catch (err) {
        res.json({ message: err.message, flag: "error" });
    }
});

app.post("/addNewMember", async (req, res) => {
    try {

        const today = new Date();
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        const date = today.toLocaleString('en-US', options);


        let { presidentName, clubName, members } = req.body;
        // console.log(req.body);
        // for (let index = 0; index < members.length; index++) {
        //     members[index].clubName=clubName;
        //     members[index].presidentName=presidentName;
        //     members[index].date=date;
        //     members[index].status="Pending";
        // }

        // console.log(members);
        const addMember = new Request({
            clubName: clubName,
            presidentName: presidentName,
            members: members,
            date: date,
            status: "Pending",
            members: members
        });
        addMember.save();
        console.log(addMember);
        if (addMember) {
            res.json({ message: "Member Added Successfully", flag: "success" });
        }
    } catch (err) {
        res.json({ message: err.message, flag: "error" });
    }
});

app.get("/getNewMembers", async (req, res) => {
    try {
        console.log("Fetching new members requests");

        const requests = await Request.find();
        console.log(requests);
        res.json({
            data_: requests,
            flag: "success"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching data",
            flag: "error"
        });
    }
});


app.post("/requestApproval/:id", async (req, res) => {
    try {
        let { status } = req.body;
        let { id } = req.params;
        const update = await Request.updateOne({ _id: id }, { status: status });
        console.log("Updated");
        console.log(update);
        if (update.modifiedCount > 0) {
            res.json({ message: "Member Added Successfully", flag: "success" });

            if(status==="Approved"){
                const userData=await Request.find({_id:id});
                // add new members in the particular club collection ._detils
                const clubData = await Club.find({ name: userData[0].clubName });
                let user_ = new Club({
                    name: clubData[0].name,
                    president: clubData[0].president,
                    category: clubData[0].category,
                    faculty: clubData[0].faculty,
                    status: clubData[0].status,
                    maxMembers: clubData[0].maxMembers,
                    members: [...clubData[0].members, ...userData[0].members]
                });
                // const user_=new Club({
                //     members:userData[0].members
                // });
                user_.save();
            }
        }

    } catch (err) {
        res.json({ message: err.message, flag: "error" });
    }
})
//logging out.
app.get("/logout", async (req, res) => {
    res.cookie("login", "false", { secure: false });
    res.json({ message: "Logged Out Sucessfully", "flag": "success" });
});