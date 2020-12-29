const express = require('express');
const router  = express.Router();
const passport  = require('passport');

//Upload related
const multer            = require('multer');
const registerUpload    = multer({
  limits : {
  fileSize : 1000000,
  },
  fileFilter(req,file,cb) {
    console.log(file.originalname);
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error('Only the extensions (png|jpeg|jpg) are acceptable'));
    }
    cb(undefined,true);
  }
});

//Costume middleware for local users
const {
  isUserExisting,
  isUserAlreadyExisting,
  checkPassword,
  ensureAuth,
  keepGest
} = require('../middleware/auth.js');

//Local user controller
const {
  registerCtrl,
  loginSuccess,
  loginFailure,
  getAvatar
} = require('../controllers/auth.controller.js');

// @desc  Auth whit google
// @met/route GET /auth/google
router.get('/google' , passport.authenticate('google' ,{ scope : ['profile'] } ));


// @desc  google auth callback
// @met/route GET /auth/google/dashboard
router.get('/google/callback' , passport.authenticate('google' , {
  failureRedirect : '/'
}) , (req , res) => {
  res.redirect('/dashboard');
});

//Lacal Auth

//Register
router.post('/register',registerUpload.any(),isUserAlreadyExisting,registerCtrl);
//Login
router.post('/login',isUserExisting,checkPassword
            ,passport.authenticate('local',
            {
              failureRedirect: '/auth/login-failure',
              successRedirect: '/auth/login-success'
            }));

//loginSuccess
router.get('/login-success',loginSuccess);
//loginFailure
//if unexpected behavior otherwise it shall not run
router.get('/login-failure',loginFailure);

// @desc  Logout user
// @met/route GET /auth/logout
router.get('/logout' , (req , res) => {
  req.logout();
  res.redirect('/');
});

//Avatar
// @desc  get avayar image
// @met/route GET /auth/avatar
router.get('/avatar',ensureAuth,getAvatar);

module.exports = router;
