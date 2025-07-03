const mongoose=require("mongoose");

const admins=new mongoose.Schema({
    admin_id:{
        type:String,
    },
     address:{
        type:String,
    }
});

const Admin=new mongoose.model("Admin",admins);

module.exports=Admin;