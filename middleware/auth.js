const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const validPassword  = require('../lib/utils_password.js').validPassword;

// will be used to check before registering the user
const isUserAlreadyExisting = async (req,res,next) => {
  // E short for Exists
  const emailE = await User.findOne({email : req.body.username});
  if(emailE) return res.status(400).json({err : "User already exist."});
  next();
}

const isUserExisting = async (req,res,next) => {
  if(req.body.username) {
    const emailExist = await User.findOne({ email : req.body.username });
    if(!emailExist) return res.status(400).json({err : "email incorrect."});
  }
  next();
}

const checkPassword = async (req,res,next) => {
  const user = await User.findOne({email : req.body.username});
  const isPassValid = await bcrypt.compare(req.body.password , user.password);
  if(!isPassValid) return res.status(400).json({err : "incorrect password."})
  next(); //this should be the last middleware else uncomment this line
}

//@Desc ensure that the unauthenticated user stays at (/)
const ensureAuth = (req , res , next) => {
  console.log(req.isAuthenticated());
  if(req.isAuthenticated()) {
    return next();
  }else{
    res.redirect('/');
  }
}

const keepGest = (req , res , next) => {
  if(req.isAuthenticated()) {
    res.redirect('/dashboard'); //keep users in home page
  }else{
    return next();
  }
}

module.exports = {
  isUserExisting,
  isUserAlreadyExisting,
  checkPassword,
  ensureAuth,
  keepGest
}
