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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
