const User           = require('../models/User.js');
const authStrategies = require('./strategies.js');
const localStrategy  = require('passport-local').Strategy;//To create the strategy instance


module.exports = function(passport) {
  //local
  const strategy = new localStrategy(authStrategies.verifyCallback);
  passport.use(strategy);

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
