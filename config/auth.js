const jwt = require("jsonwebtoken")
const User = require("../models/User")


const ensureAuthenticated = function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      // req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/users/login');
    }
const forwardAuthenticated = function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    }
  
// The following function acts to authenticate a request from the client. The client will send the requesting user's login token (web token) as the 'authorization' header.
// This header has in it the token to be authorized. This authorization is done with jwt verify() and if it is verified, then the request is granted

const auth = async function (req,res,next) {

  try{
      // const token = req.header("Authorization").replace("Bearer ","") // Uncomment this line during development for testing with postman - store tokem in header with some js
      const token = req.headers.authorization.split(' ')[1]
      // const token = req.cookies['auth_token']
      console.log(token);
      const decoded = jwt.verify(token, "THEPCONE")
      const user = await User.findOne( { _id: decoded._id,isAdmin:decoded.isAdmin, "tokens.token":token })
      if(!user) {
          throw new Error()
      }

      req.token = token
      req.user = user
      next()
  } catch (e) {
      console.log(e)
      res.status(401).send("Please authenticate")
  }
}

const adminAuth = function (req,res,next){
  try{
      const token = req.header("Authorization").replace("Bearer ","")
      const decoded = jwt.verify(token ,'THEPCONE')
      // console.log("from Admin Auth: isAdmin: ",decoded.isAdmin)
      if(decoded.isAdmin ==="-1"){
          throw new Error()
      }

      next()
      
  } catch(e){
      res.status(401).send("You are not karan bhowmick.")
  }
}

module.exports = {
  auth, adminAuth, forwardAuthenticated, ensureAuthenticated
}
  //Error types:
  //Access hierarchy error: 401