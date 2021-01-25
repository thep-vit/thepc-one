const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const router = express.Router()


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

router.get("/",
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/verified', 
    passport.authenticate('google', { failureRedirect: '/users/login' }),
        async (req, res) => {
        const foundUser = req.user;
        res.status(200).send({foundUser});
})

router.post('/auth', async (req, res) => {
    const {email, username } = req.body;
    try {
      const foundUser = await User.findOne( {email} );

      if(foundUser){
        await foundUser.generateToken();
        res.status(200).send(foundUser)
      }else{
        const newUser =new User({ email: email, username: username});
        await newUser.save();await newUser.generateToken();
        return res.status(200).send(newUser)
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
})

module.exports = router