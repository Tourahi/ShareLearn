const User   = require('../models/User.js');
const bcrypt = require('bcryptjs');
const validPassword = require('../lib/utils_password.js').validPassword;
const {  RegisterValidationSchema,
         LoginValidationSchema} = require('../models/validations/userValidations.js');

const authCtrl = {};

authCtrl.registerCtrl = async function (req , res) {
  //Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password , salt);

  const Body = {
    email : req.body.username,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    displayName : req.body.firstName+" "+req.body.lastName,
    password : req.body.password,
    avatar : "DummyAvatar",
    role : "Contributor"
  }
  const {error} = RegisterValidationSchema.validate(Body);
  if(error) return res.status(400).json({err : error.details[0].message});
  Body.password = hashedPass;
  const user = new User(Body);
  try{
    const savedUser = await user.save();
    res.json({user : savedUser._id});
  }catch(e){
    return res.status(500).json({err :"Server Error Unable to save the user."});
  }
};

// verifyCallback for the passport strategy
authCtrl.verifyCallback = (username , password , done) => {

  User.find({email : username})
      .then(async (user) => {
        if(!user) return done(null, false)
        const isValid =  await validPassword(username , password);
        if(isValid) {
          return  done(null, user);
        }else{
          return done(null, false);
        }
      })
      .catch((err) => {
        done(err);
      });
};

authCtrl.loginSuccess = (req , res , next) => {
  res.status(200).json({ user : req.user});
};

authCtrl.loginFailure = (req , res , next) => {
  res.status(400).json({ err : 'You are not Authenticated'});
}

module.exports = authCtrl;
