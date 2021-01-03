const express = require('express');
const router  = express.Router();
const lessonCtrl = require('../controllers/lesson.controller');

//Costume middleware for local users
const {
  isUserExisting,
  isUserAlreadyExisting,
  checkPassword,
  ensureAuth,
  keepGest
} = require('../middleware/auth.js');

//Upload related
const multer            = require('multer');
const filesUpload    = multer({
  limits : {
  fileSize : 7000000,
  },
  fileFilter(req,file,cb) {
    console.log(file.originalname);
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error('Only the extensions (png|jpeg|jpg) are acceptable'));
    }
    cb(undefined,true);
  }
});

router.get('/',ensureAuth, lessonCtrl.pLessons);
router.get('/add',ensureAuth, lessonCtrl.add);
router.post('/',filesUpload.any(),ensureAuth, lessonCtrl.addPOST);
router.get('/edit/:id',ensureAuth,lessonCtrl.editL);
router.post('/:id',filesUpload.any(),ensureAuth,lessonCtrl.Lupdate);

module.exports = router;
