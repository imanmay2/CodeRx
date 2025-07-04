const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    president: {
        //stores the regNo.
        type: String,
      
    },
    category: {
        type: String,
        
    },
    members: [{
        regNo: {
            type: String,
        },
        name: {
            type: String
        },email:String
    }],
    faculty: {
        //stores the faculty_id
        type: String,
        
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
        
    },
    maxMembers: {
        type: Number,
        
    }
});

const Club = new mongoose.model("Club", clubSchema);
module.exports = Club;