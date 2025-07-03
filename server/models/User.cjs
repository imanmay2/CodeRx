const mongoose=require("mongoose");

const users=new mongoose.Schema({
     name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
     role:{
        type:String,
        required:true
    },
     address:{
        type:String,
    },id:{
        //regNo, faculty_id
        type:String,
        required:true
    }
});

const User=new mongoose.model("User",users);
module.exports=User;