require('dotenv').config();

const express = require('express')
const router = express.Router()

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  //////////////TAKEN FROM PASSPORT OAUTH WEBSITE//////////////////
  passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/thepcone",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
      // console.log(profile);
        User.findOrCreate({ googleId: profile.id, email: profile.displayName, name: profile.name.familyName }, function (err, user) {
        return cb(err, user);
      });
    }
  ));
  
  
  router.get("/google",
    passport.authenticate('google', { scope: ["profile"] })
  );
  
  router.get("/google/thepcone",
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect dashboard? page.
      res.redirect('/thepcone');
    });
  
  
  router.get("/login", function(req, res) {
    res.render("login");
  })
  
  router.get("/register", function(req, res) {
    res.render("register");
  })
  

  module.exports = router;