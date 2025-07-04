const mongoose = require("mongoose");

const requests = new mongoose.Schema({

    clubName: {
        type: String,
        required: true
    },
    presidentName: {
        type: String,
        required: true
    },
    members: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        regNo: {
            type: String,
            required: true
        }
    }],

    date: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },



});

const Request = new mongoose.model("Request", requests);
module.exports = Request;