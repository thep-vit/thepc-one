const express = require("express")
const router = express.Router()
const User = require("../models/User")
const passport = require('passport')
const { ensureAuthenticated } = require("../config/auth")
// Dynamic Rendering with EJS Templating Engine 
// GET requests that render the pages

router.get("", (req,res)=> {
    res.send("HElooo");
    // res.render("index")
})

router.get("/login", (req,res)=> {
    res.render("login")
})

router.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: "/users/dashboard",
        failureRedirect: "/users/login"
    })(req, res, next);
})

router.get("/register", (req,res)=> {
    res.render("register")
})

router.post("/register", async (req, res)=>{
    const { username, email, password, password2 } = req.body;
    let error = [];
    if(password.length < 6){
        error.push({msg: 'Password should be at least 6 characters long.'})
    }

    if(password !== password2){
        error.push({msg: "Passwords do not match."} );
    }

    if(error.length > 0){
        res.render('register', {
            username,
            email})
    }else{
        const foundUser = await User.findOne({ email: email});
        if(foundUser){
            res.send(`User with email ${email} already exists.`).status(400);
        }else{
            const newUser = new User({
                username, email, password
            });

            await newUser.save();
            console.log(newUser);
            res.send("registered!!");
        }
    }
})

router.get("/dashboard", ensureAuthenticated, (req,res)=> {
    res.render("views")
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
})

module.exports = router