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
    passport.authenticate('google', { scope: ['profile', 'email'] })
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
        const token = await user.generateToken();
        console.log(user);
        return done(null, user);
      }else{
        const nUser = new User({
          googleId: profile.id,
          // username: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value
        });
        await nUser.generateToken();
        await nUser.save();
        console.log(profile);
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

  
  router.get("/google",
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
    
  router.get('/google/verified', 
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  async (req, res) => {
    // Successful authentication, redirect home.
    const foundUser = req.user;
    // const token = await foundUser.generateToken()
    res.status(200).send({foundUser});
  });

  // router.get('/home', 
  // passport.authenticate('google', { failureRedirect: '/users/login' }),
  // async (req, res) => {
  //   // Successful authentication, redirect home.
  //   const foundUser = req.user;
  //   // const token = await foundUser.generateToken()
  //   console.log(foundUser);
  //   res.status(200).send({foundUser});
  // });
  

  //@route    /api/user/signup
  //@privacy  public
  //@method   POST
  //@res      Register user for THEPC One
  router.post('/user/signup', async (req, res) => {
    const { email, password, password2, name } = req.body;
    
    try {
      const foundUser = await User.findOne({email: email});
      if(foundUser){
        return res.status(500).send({message: `User with email ${email} already exists.`})
      }else if(password !== password2){
        return res.status(500).send({message: "Passwords do not match"});
      }else{
        const newUser = new User({email: email, password: password, username:name});
        await newUser.save();
        await newUser.generateToken();
        return res.status(200).send(newUser);

      }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
  });

  //@route    /api/user/login
  //@privacy  puhblic
  //@method   POST
  //@res      login route using form  
  router.post('/user/login', async (req, res) => {
    try {
        const userFound = await User.findByCredentials(req.body.email, req.body.password);
        await userFound.generateToken();

        res.status(200).send(userFound);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);      
    }
  });

  //@route    /api/user/:eventID
  //@privacy  auth users
  //@method   PATCH
  //@res      Register user for event with id = req.params.id  
  router.patch('/user/:eventID', auth, async (req, res) => {
    const user = req.user;
    const foundEvent = await Event.findById({_id: req.params.eventID})
    
    //Add missing attr to user and event objects (safety feature)
    if(!req.user.eventsRegistered){
      user.eventsRegistered = [];
      await user.save();
    }
    if(!foundEvent.regCount && foundEvent.regCount !== 0){
      foundEvent.regCount = 0;
    }
    if(!foundEvent.regUsers){
      foundEvent.regUsers = [];
    }

    //Check if user already registered
    for (let index = 0; index < user.eventsRegistered.length; index++) {
      if(user.eventsRegistered[index]._id === req.params.eventID){
        user.eventsRegistered = [];
        user.save();
        return res.send({"error": "You've already registered for this event."});
      }
      
    }

    //Add a reg count to the event object
    foundEvent.regCount += 1;
    foundEvent.regUsers.push({
      _id: user._id,
      name: user.username,
    });

    const regEvent = {
      _id: req.params.eventID,
      name: foundEvent.eventName,
      date: foundEvent.eventStart
    }

    //Add registered event to the particular user object
    user.eventsRegistered.push(regEvent);

    //Save changes
    await user.save();
    await foundEvent.save();

    //Send res
    console.log(foundEvent);
    res.send(user);
  });

  
  //@route    /api/allEvents
  //@privacy  auth users
  //@method   GET
  //@res      Gets all events
  router.get('/allEvents', async (req, res) => {
    const allEvents = await Event.find();
    console.log(allEvents);
    res.send(allEvents);
  });

  //@route    /api/newEvent
  //@privacy  only members
  //@method   POST
  //@res      Adds a new event to the list of events
  router.post('/newEvent', auth, memberAuth, async (req, res) => {
    const {eventName, eventDesc, eventLink, numTextBoxes, numMultiChoice, numOptions, numFileUploads, isTextBoxes, isMultiChoice, isFileUpload, eventStart, eventEnd, regStart} = req.body;

    const newEvent = new Event({
      eventDesc, eventLink, eventName, numTextBoxes, numMultiChoice, nunmOptions, numFileUploads, isTextBoxes, isMultiChoice, isFileUpload, eventStart, eventEnd, regStart
    });

    await newEvent.save();

    res.send({newEvenet: newEvent}).status(200);
});

  //@route    /api/approveEvent/:id
  //@privacy  only board members
  //@method   PATCH
  //@res      Approves the event with id = req.params.id
router.post('/approveEvent/:id', auth, async (req, res) => {

  const foundEvent = await Event.findById(req.params.id);

  foundEvent.approved = true;
  await foundEvent.save();

  res.send(foundEvent).status(200);
});
    
  module.exports = router



  