const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    memberType:{
        type: Number,
        default: -1,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;