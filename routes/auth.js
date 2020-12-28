const express = require('express');
const router  = express.Router();
const passport  = require('passport');

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
  loginFailure
} = require('../controllers/auth.controller.js');

// @desc  Auth whit google
// @met/route GET /auth/google
router.get('/google' , passport.authenticate('google' ,
                                {
                                  scope : ['profile'],
                                  // session : false
                                }
                              ));


// @desc  google auth callback
// @met/route GET /auth/google/dashboard
router.get('/google/callback' , passport.authenticate('google' , {
  failureRedirect : '/'
}) , (req , res) => {
  res.redirect('/Giverole');
});

//Lacal Auth

//Register
router.post('/register',isUserAlreadyExisting,registerCtrl);
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

module.exports = router;
