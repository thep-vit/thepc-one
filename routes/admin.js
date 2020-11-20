const express = require("express")
const router = express.Router()
const User = require("../models/User")
const passport = require('passport')
const { ensureAuthenticated } = require("../middleware/auth")

const Event = require('../models/Event');

router.post('/newEvent', ensureAuthenticated, async (req, res)=>{
    console.log(req.body);
    console.log(req.profile);
    const { eventName, eventDesc, eventLink } = req.body;
    const newEvent = new Event({
        eventName,
        eventDesc,
        eventLink
    });
    await newEvent.save();
    res.send(newEvent);
} )

router.get('/dashboard', ensureAuthenticated, (req, res)=>{
    console.log(req.body);
    console.log(req.profile);
    res.render('event');
} )

module.exports = router