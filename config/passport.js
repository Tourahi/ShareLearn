const User           = require('../models/User.js');
const authStrategies = require('./strategies.js');
const {verifyCallback} = require('../controllers/auth.controller.js');
const localStrategy  = require('passport-local').Strategy;//To create the strategy instance
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function(passport) {
  //Google
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },authStrategies.google));

  //local
  const strategy = new localStrategy({ usernameField: 'email' },verifyCallback);
  passport.use(strategy);

  passport.serializeUser(async function(user, done) {
    // note From : Tourahi Amine
    // The first time the user my be pending so i've used await here.
    const User = await user;
    // console.log("From serializeUser",user);
    if(Array.isArray(user)) {
      done(null, User[0]._id); //Note Tourahi : Here we used findAll in the local auth so is returns a table
    }else {
      done(null, User._id);
    }
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then((user) => {
          done(null, user);
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        });
  });
}
