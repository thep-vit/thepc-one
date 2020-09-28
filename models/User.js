const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const validator = require("validator")

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String
    },
    username:{
        type: String,
        // required: true
    },
    password: {
        type: String
    },
    email:{
        type:String,
        // required: true
    },
    photo: {
        type: String,
    },
    token: {
        type: String,
    },
    memberType:{
        type: Number,
        default: -1,
        required: true
    },
    eventsRegistered: [{
        _id: {
            type: String,
        }, 
        name: {
            type: String,
        }
    }],
    isAdmin:{
        type: Boolean,
        required:true,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    date:{
        type: Date,
        default: Date.now
    }
});


UserSchema.methods.generateToken = async function () {
    const findUser = this
    const token = jwt.sign({ _id:findUser._id.toString(), memberType:findUser.memberType.toString() }, "THEPCONE")
    
    findUser.tokens = findUser.tokens.concat({ token })
    // console.log("TOKEN ADDED:",findUser)
    await findUser.save()
    return token

}

UserSchema.pre("save", async function(next) {
    const user = this
    // console.log("this prints before saving")

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()

})

UserSchema.statics.findByCredentials = async (email, password) => {
    const findUser = await User.findOne({ email })
    if(!findUser) {
        throw new Error ("Unable to Login!")
    }
    console.log("USer found: " + findUser);
    const isMatch = await bcrypt.compare(password, findUser.password)

    if(!isMatch) {
        throw new Error("Unable to Login!")
    }
    return findUser

}

//Password reset token generation
UserSchema.methods.generatePasswordReset =  function(){
    this.resetPasswordToken = jwt.sign({ _id:this._id.toString() }, "THEPCONE")
    this.resetPasswordExpires = Date.now() + 3600000;
  };

const User = mongoose.model("User", UserSchema);

module.exports = User;