const User   = require('../models/User.js');
const bcrypt = require('bcryptjs');
const validPassword = require('../lib/utils_password.js').validPassword;
const {  RegisterValidationSchema,
         LoginValidationSchema} = require('../models/validations/userValidations.js');

//Upload related

const sharp = require('sharp');

//End Upload related
const authCtrl = {};

authCtrl.registerCtrl = async function (req , res) {
  //Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password , salt);

  //User construction
  const Body = {
    email : req.body.email,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    displayName : req.body.firstName+" "+req.body.lastName,
    password : req.body.password,
    avatar : {
      buffer : await sharp(req.files[0].buffer).resize({width : 96, height : 96})
              .png().toBuffer(),
      ext    : req.files[0].originalname.split('.').pop()
    },
    role : "Contributor"
  }
  const {error} = RegisterValidationSchema.validate(Body);
  if(error) return res.status(400).json({err : error.details[0].message});
  Body.password = hashedPass;
  const user = new User(Body);
  try{
    await user.save();
    //return res.status(201).send({}); // For testing
    return res.status(200).redirect("/dashboard");
  }catch(e){
    return res.status(500).json({err :"Server Error Unable to save the user."});
  }
};

// verifyCallback for the passport strategy
authCtrl.verifyCallback = (email , password , done) => {

  User.find({email})
      .then(async (user) => {
        if(!user) return done(null, false)
        const isValid =  await validPassword(email , password);
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
  // res.status(200).json({ user : req.user});
  res.status(200).redirect("/dashboard");
};

authCtrl.loginFailure = (req , res , next) => {
  res.status(400).json({ err : 'You are not Authenticated'});
}

//avatar handeling
authCtrl.getAvatar = (req,res,next) => {
  if(!req.user.avatar.link){
      res.set('Content-Type',`image/${req.user.avatar.ext}`);
      res.status(200).send(req.user.avatar.buffer);
  }else {
    res.status(200).send(req.user.avatar.link);
  }

  //req.user
};

module.exports = authCtrl;
