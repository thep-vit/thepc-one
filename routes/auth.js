require('dotenv').config();

const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const findOrCreate = require('mongoose-findorcreate')

const User = require('../models/User')

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/verified"
  },
  async (accessToken, refreshToken, profile, done) => {
    await User.findOne({ googleId: profile.id }, async (err, user) => {
      if(user){
        // console.log(profile);
        console.log("OLD");
        return done(null, profile);
      }else{
        const nUser = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.name.familyName
        });
        console.log("nUser");
        console.log(nUser);
        await nUser.save();
        return done(null, profile);
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
  
  
  router.get("/google",
    passport.authenticate('google', { scope: ["profile"] })
  );
  
  router.get('/google/verified', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.send({profile: req.user}).redirect('/api/admin/dashboard');
  });
  
  module.exports = router;