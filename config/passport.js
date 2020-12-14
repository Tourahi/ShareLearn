const User           = require('../models/User.js');
const authStrategies = require('./strategies.js');
const localStrategy  = require('passport-local').Strategy;//To create the strategy instance
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function(passport) {
  //local
  const strategy = new localStrategy(authStrategies.verifyCallback);
  passport.use(strategy);

  //Google
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },authStrategies.google));

  passport.serializeUser(async function(user, done) {
    // note From : Tourahi Amine
    // The first time the user my be pending so i've used await here.
    const User = await user;
    done(null, User._id);
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
