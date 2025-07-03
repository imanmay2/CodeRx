const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true
    },
    clubPresident: {
        //stores the regNo.
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true
    },
    members: [{
        regNo:{
            type:String,
        },
        Name:{
            type:String
        }
    }],
    faculty: {
        //stores the faculty_id
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        
    },
    updatedAt: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        required: true
    },
    maxMembers: {
        type: Number,
        required: true
    }
});

const Club = new mongoose.model("Club", clubSchema);
module.exports = Club;