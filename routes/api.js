require('dotenv').config();

const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const { check } = require('express-validator')
const { ensureAuthenticated, auth, memberAuth, adminAuth } = require("../middleware/auth")

const User = require('../models/User')
const Event = require('../models/Event')

router.patch('/approveEvent/:id', auth, adminAuth, async (req, res) => {

  const foundEvent = await Event.findById(req.params.id);

  foundEvent.approved = true;
  await foundEvent.save();

  res.send(foundEvent).status(200);
});
  
  router.get("/google",
    passport.authenticate('google', { scope: ['email'] })
  );

//API Documentation
/**
 * @api {post} /api/newEvent
 * @apiName GoogleOAuth
 * @apiGroup Events
 *
 * @apiParam {String} eventName          Mandatory event name.
 * @apiParam {String} eventDesc          Mandatory event description.
 * @apiParam {String} eventLink          Mandatory  event link.
 * 
 * @apiSuccess {Boolean} approved Approval status of the event.
 * @apiSuccess {mongoID} _id  mongoID of the user object.
 * @apiSuccess {String} eventDesc Event description.
 * @apiSuccess {String} eventLink Link for the event.
 * @apiSuccess {String} eventName Name of the event.
 * @apiSuccess {Date} dateCreated Date of creation of the event.
 * @apiSuccess {String} token auth tokens array
 *
 * @apiSuccessExample newEvent:
 *     {
 *   "approved": false,
 *    "_id": "5f6870823dcf5d40a0fa6d28",
 *   "eventDesc": "ABC Event",
 *   "eventLink": "https://www.com",
 *   "eventName": "ABC",
 *   "dateCreated": "2020-09-21T09:21:06.111Z",
 *   "__v": 0
}
 *
 * @apiError authError Please authenticate.
 * @apiError adminError You do not have admin rights.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 **/
/**
 * @api {patch} /api/approveEvent/:id
 * @apiName THEPC One
 * @apiGroup Events
 * 
 * @apiParam {String} id eventID which is stored as mongoID on teh database.
 * @apiSuccess {Boolean} approved Approval status of the event.
 * @apiSuccess {mongoID} _id  mongoID of the user object.
 * @apiSuccess {String} eventDesc Event description.
 * @apiSuccess {String} eventLink Link for the event.
 * @apiSuccess {String} eventName Name of the event.
 * @apiSuccess {Date} dateCreated Date of creation of the event.
 * @apiSuccess {String} token auth tokens array
 * @apiSuccessExample approvedEvent:
 *     {
 *   "approved": true,
 *    "_id": "5f6870823dcf5d40a0fa6d28",
 *   "eventDesc": "ABC Event",
 *   "eventLink": "https://www.com",
 *   "eventName": "ABC",
 *   "dateCreated": "2020-09-21T09:21:06.111Z",
 *   "__v": 0
}
 *
 * @apiError authError Please authenticate.
 * @apiError adminError You do not have admin rights.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 **/
/** 
 * @api {get} /google/verified
 * @apiName GoogleOAuth
 * @apiGroup User
 *
 * @apiSuccess {Integer} memberType member classifications of Users.
 * @apiSuccess {mongoID} _id  mongoID of the user object.
 
 *
 * @apiSuccessExample newEvent:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 **/

passport.use(new GoogleStrategy({
    clientID: "390060085294-k1l5r25ugf2jpsqorsmns7m8o3ject6f.apps.googleusercontent.com",
    clientSecret: "CGSdCoQ0dUn3-yoTDzVYd7wB",
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

    
  router.get('/google/verified', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  async (req, res) => {
    // Successful authentication, redirect home.
    const foundUser = req.user;
    // const token = await foundUser.generateToken()
    res.send({foundUser})
  });
  

  router.get('/testAuth', auth, (req, res) => {
      res.send("This is authorized route");
  })

  router.post('/newEvent', auth, memberAuth, async (req, res) => {
    const {eventName, eventDesc, eventLink} = req.body;

    const newEvent = new Event({
      eventDesc, eventLink, eventName
    });

    await newEvent.save();

    res.send({newEvenet: newEvent}).status(200);
});

router.patch('/approveEvent/:id', auth, adminAuth, async (req, res) => {

  const foundEvent = await Event.findById(req.params.id);

  foundEvent.approved = true;
  await foundEvent.save();

  res.send(foundEvent).status(200);
});
  
  router.get("/google",
    passport.authenticate('google', { scope: ['email'] })
  );


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



  