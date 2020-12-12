const User          = require('../models/User.js');
const validPassword = require('../lib/utils_password.js');

const authStrategies = {};

//Local Strategie
authStrategies.verifyCallback = async (displayname,password,done) => {
  User.findOne({email})
      .then(async (user) => {
        if(!user) return done(null,false);
        const isValid = await validPassword(displayname
                                            ,password);
        if(isValid){
          return done(null,user);
        }else{
          return done(null,false);
        }
      }).catch((err) => {
        done(err);
      });
};

module.exports = authStrategies;
