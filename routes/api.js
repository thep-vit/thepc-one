require('dotenv').config();

const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const multer = require('multer')
const sharp = require("sharp")
const { check } = require('express-validator')
const { auth, memberAuth, adminAuth } = require("../middleware/auth")
const { logger }  = require("../middleware/reqLogger")

const User = require('../models/User')
const Event = require('../models/Event')
const CCS = require('../models/CCS')
const Log = require('../models/Log')


// const upload = multer({
//   limits: {
//       fileSize: 5000000
//   },
//   fileFilter(req,file,cb) {
//       if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/)) {
//           return cb(new Error("Upload Proper File"))
//       }
//       cb(undefined,true)
//   }
// })

const upload = multer({
  limits: {
      fileSize: 5000000
  },
  fileFilter(req,file,cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|PNG|JPEG|pdf|PDF|doc|DOC|DOCX|docx)$/)) {
          return cb(new Error("Upload Proper File"))
      }
      cb(undefined,true)
  }
})


router.patch('/approveEvent/:id', auth, logger, adminAuth, async (req, res) => {

  const foundEvent = await Event.findById(req.params.id);

  foundEvent.approved = true;
  await foundEvent.save();

  res.send(foundEvent).status(200);
});
  
  router.get("/google",
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

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
        const userToken = await nUser.generateToken();
        await nUser.save();

        const userEmail = nUser.email

        const addLog = {
            route: '/auth/google',
            method: 'POST',
            date: Date.now()
        }
        const newLog = new Log({
            userEmail: userEmail,
            startTime: Date.now(),
            startToken: userToken
        })

        newLog.logs.push(addLog)
        await newLog.save()
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
        const userToken = await newUser.generateToken();

        console.log(newUser)

        // const userToken = newUser.tokens[req.user.tokens.length - 1].token
        const userEmail = req.body.email
        
        const addLog = {
          route: '/user/signup',
          method: 'POST',
          date: Date.now()
        }

        const newLog = new Log({
            userEmail: userEmail,
            startTime: Date.now(),
            startToken: userToken
        })

        newLog.logs.push(addLog)
        await newLog.save()
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
        const userToken = await userFound.generateToken();
        const userEmail = req.body.email

        const addLog = {
            route: '/user/login',
            method: 'POST',
            date: Date.now()
        }
        const newLog = new Log({
            userEmail: userEmail,
            startTime: Date.now(),
            startToken: userToken
        })

        newLog.logs.push(addLog)
        await newLog.save()

        res.status(200).send(userFound);
    } catch (err) {
      console.log(err);
      res.status(400).send(err);      
    }
  });

  router.post('/google/auth', async (req, res) => {
    const {email, username } = req.body;
    try {
      const foundUser = await User.findOne( {email} );

      if(foundUser){
        const userToken = await foundUser.generateToken();
        const userEmail = foundUser.email

        const addLog = {
            route: '/auth/google',
            method: 'POST',
            date: Date.now()
        }
        const newLog = new Log({
            userEmail: userEmail,
            startTime: Date.now(),
            startToken: userToken
        })

        newLog.logs.push(addLog)
        await newLog.save()
        res.status(200).send(foundUser)
      }else{
        const newUser =new User({ email: email, username: username});
        await newUser.save();
        const userToken = await newUser.generateToken();
        const userEmail = newUser.email

        const addLog = {
            route: '/google/auth',
            method: 'POST',
            date: Date.now()
        }
        const newLog = new Log({
            userEmail: userEmail,
            startTime: Date.now(),
            startToken: userToken
        })

        newLog.logs.push(addLog)
        await newLog.save()
        return res.status(200).send(newUser)
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  //@route    /api/user/:eventID
  //@privacy  auth users
  //@method   PATCH
  //@res      Register user for event with id = req.params.id  
  router.patch('/user/:eventID', auth, logger, async (req, res) => {
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
  router.post('/newEvent', auth, memberAuth, logger, upload.single("eventImg"), async (req, res) => {
    const {eventName, textTime, eventDesc, eventLink, numTextBoxes, numMultiChoice, numOptions, numFileUploads, isTextBoxes, isMultiChoice, isFileUpload, eventStart, eventEnd, regStart} = req.body;

    console.log(req.file)
    const buffer = await sharp(req.file.buffer).png().toBuffer()

    const user = await User.findOne({_id: req.user._id});

    const createdBy = {
      _id: user._id,
      name: user.username
    }

    const newEvent = new Event({
      eventDesc, eventLink, eventName, textTime, numTextBoxes, numMultiChoice, numOptions, numFileUploads, isTextBoxes, isMultiChoice, isFileUpload, eventStart, eventEnd, regStart, createdBy
      , eventImg: buffer
    });

    newEvent
    await newEvent.save();

    res.send({newEvent: newEvent}).status(200);
});

  //@route    /api/approveEvent/:id/:approved
  //@privacy  only board members
  //@method   PATCH
  //@res      Approves the event with id = req.params.id
router.post('/approveEvent/:id/:approved', auth, logger, async (req, res) => {

  const foundEvent = await Event.findById(req.params.id);

  
  if(req.params.approved == "true"){
    foundEvent.approved = req.params.approved;
    await foundEvent.save();
    res.send(foundEvent).status(200);
  }else{
    await Event.findByIdAndDelete(req.params.id);
    res.send({"message": `Event ${foundEvent.eventName} rejected successfully`}).status(200);
  }
});    

//@route    /api/ccs/submit
//@privacy  everyone who is logged in
//@method   POST
//@res      submits the CCS application form

router.post('/ccs/submit', auth, logger, async (req, res) => {
  try {
    const { name, email, phNum, whatsapp, regNum, depts, strengths, weaknesses, whyDoYouJoin } = req.body;

    const newCCS = new CCS({
      name, email, phNum, whatsapp, regNum, depts, strengths, weaknesses, whyDoYouJoin, applicant: req.user._id
    });

    await newCCS.save()

    const reqUser = await User.findOne({_id: req.user._id})
    if(reqUser.ccsSub){
      throw Error({"error": "You have already participated in this event!"})
    }else{
      reqUser.ccsSub = true
      await reqUser.save()
    }

    // console.log(reqUser)
    res.status(200).send(newCCS)
  } catch (error) {
    res.status(500).send(error)
  }

})

//@route    /api/ccs/submissions
//@privacy  All THEPC members
//@method   GET
//@res      Gets all CCS submissions
router.get('/ccs/submissions', auth, memberAuth, logger, async (req, res) => {
  const allSubmissions = await CCS.find()
  if(!allSubmissions){
    res.status(404).send({"message": "No submissions found!"})
  }
  res.status(200).send(allSubmissions)
})

//@route    /api/ccs/fileUpload
//@privacy  Everyone who is logged in
//@method   POST
//@res      Submits the CCS document and adds it to the existing CCS application
router.post('/ccs/fileUpload', auth, logger, upload.single("ccsFile"), async (req, res) => {
  const userSub = await CCS.findOne({"applicant": req.user._id})

  if(!userSub){
    res.status(500).send({"message": "You have not applied for CCS. This is not applicable for you!"})
  }

  const ccsDoc = await req.file.buffer 
  let entryType = req.file.mimetype
  entryType = entryType.split('/')[1]
  
  userSub.ccsDoc = ccsDoc
  userSub.entryType = entryType

  await userSub.save

  res.status(200).send(userSub)
})

module.exports = router

