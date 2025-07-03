const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    president: {
        //stores the regNo.
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    members: [{
        regNo: {
            type: String,
        },
        name: {
            type: String
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