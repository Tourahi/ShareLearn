const User          = require('../models/User.js');
const validPassword = require('../lib/utils_password.js').validPassword;

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

//google Strategie

authStrategies.google = async (accessToken,refreshToken,profile,done) => {
  console.log(profile);
  const newUser = {
    googleId : profile.id,
    email    : "google@goole.com",
    firstName   : profile.name.familyName,
    lastName    : profile.name.givenName,
    displayName : profile.displayName,
    password    : "GOOGLEACCOUNT",
    avatar      : {
      buffer : null,
      link   : profile.photos[0].value,
      ext    : null
    },
    role : null
  };

  try {
    let user = await User.findOne({googleId : newUser.googleId});
    if(user) {
      done(null,user);
    }else{
      user = User.create(newUser);
      done(null,user);
    }
  }catch(err) {
    console.log(err);
  }
};

module.exports = authStrategies;
