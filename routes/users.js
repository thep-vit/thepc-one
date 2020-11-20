const express = require("express")
const router = express.Router()
const User = require("../models/User")
const passport = require('passport')
const { ensureAuthenticated, isAdmin } = require("../config/auth")
// Dynamic Rendering with EJS Templating Engine 
// GET requests that render the pages

router.get("/auth/test", ensureAuthenticated, (req,res)=> {
    res.send(req.user);
    // res.render("index")
})

router.get("/login", (req,res)=> {
    res.render("login")
})

router.get("/dashboard", ensureAuthenticated, (req,res)=> {
    res.render("views")
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
})

module.exports = router