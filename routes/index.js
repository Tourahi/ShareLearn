const express = require('express');
const router  = express.Router();

//Costume middleware for local users
const {
  isUserExisting,
  isUserAlreadyExisting,
  checkPassword,
  ensureAuth,
  keepGest
} = require('../middleware/auth.js');

// @desc  Login/Landing page
// @ met/route GET /
router.get('/',keepGest,(req , res) => {
  res.render('login' , { layout : 'login'});
});

// @desc  Dashboard
// @ met/route GET /dashboard
router.get('/dashboard' ,ensureAuth ,async (req , res) => {
  try {
    let imge = "";
    if(req.user.avatar.link) {
      imge = req.user.avatar.link;
    }else {
      imge = "data:image/png;base64,"+req.user.avatar.buffer.toString('base64');
    }
    res.render('dashboard' , {
      name : req.user.firstName,
      avatar : imge,
      layout : 'main'
    });
  } catch (err) {
    res.render('error/500');
  }
});

module.exports = router;
