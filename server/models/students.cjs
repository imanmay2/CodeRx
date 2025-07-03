const mongoose = require("mongoose");

const students = new mongoose.Schema({
    branch: {
        type: String,
        // required: true
    },club:{
        type:String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Student = new mongoose.model("Student", students);
module.exports = Student;