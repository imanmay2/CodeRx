const mongoose = require("mongoose");

const faculties = new mongoose.Schema({
    club: {
        type: String,
        // required: true
    }, userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Faculty = new mongoose.model("Faculty", faculties);
module.exports = Faculty;