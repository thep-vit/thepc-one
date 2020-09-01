require('dotenv').config();

const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const { check } = require('express-validator')
const {auth, adminAuth } = require("../config/auth")

const User = require('../models/User')


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/google/verified"
  },
  async (accessToken, refreshToken, profile, done) => {
    await User.findOne({ googleId: profile.id }, async (err, user) => {
      if(user){
        await user.generateToken();
        console.log(user);
        return done(null, profile);
      }else{
        const nUser = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.name.familyName
        });
        await nUser.generateToken();
        await nUser.save();
        console.log(user);
        return done(null, nUser);
      }
    });
  })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user)
    
  });
  

  router.get('/testAuth', auth, (req, res) => {
      res.send("This is authorized route");
  })
  
  router.get("/google",
    passport.authenticate('google', { scope: ["profile"] })
  );
  
  router.get('/google/verified', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  async (req, res) => {
    // Successful authentication, redirect home.
    const foundUser = req.user;
    // const token = await foundUser.generateToken()
    res.send({foundUser})
  });


  // Get Name of Author
router.get("/users/name/:id", async (req,res)=> {
    try {
        const userName = await User.findById(req.params.id).select("name")
        if (!userName){
            return res.status(404).send
        }
        res.send(userName.name)
        
        
    } catch (e){
        res.status(400).send()
    }
})
  
  module.exports = router