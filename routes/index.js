const express = require('express');
const router  = express.Router();


// @desc  Login/Landing page
// @ met/route GET /
router.get('/',(req , res) => {
  res.render('login' , { layout : 'login'});
});

// @desc  Login/Landing page
// @ met/route GET /
router.get('/Giverole',(req , res) => {
  res.render('Giverole' , { layout : 'main'});
});

module.exports = router;
