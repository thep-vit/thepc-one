const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});


//Hash plain text password before save
UserSchema.pre("save", async function(next) {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10)
    }    
    next()
})

const User = mongoose.model("User", UserSchema);

module.exports = User;