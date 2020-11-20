const express = require("express")
const router = express.Router()
// const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

// Dynamic Rendering with EJS Templating Engine 
// GET requests that render the pages

router.get("/", (req,res)=> {
    res.render("index")
})

// router.get("/dashboard", ensureAuthenticated, (req, res) => {
//     res.send(req.user);
// })

module.exports = router