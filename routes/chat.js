const express = require('express');
const router  = express.Router();

var html_chat_dir = './views/chating/';
//Costume middleware for local users
const {
  isUserExisting,
  isUserAlreadyExisting,
  checkPassword,
  ensureAuth,
  keepGest
} = require('../middleware/auth.js');

// @desc  Discussion/Landing page
// @ met/route GET /
router.get('/discussion',ensureAuth,(req , res) => {
  res.render('discussion' , { layout : 'main',name : req.user.firstName,});
});

// @desc  Discussion/Landing page
// @ met/route GET /
router.get('/chat',ensureAuth,(req , res) => {
  res.sendFile('chat.html',{ root: html_chat_dir });
});

module.exports = router;
