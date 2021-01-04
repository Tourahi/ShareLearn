const Lesson   = require('../models/Lesson.js');



const lessonCtrl = {};

// @desc  Add/Adding a lesson page
// @ met/route POST /
lessonCtrl.addPOST = async (req,res) => {
  try {
    req.body.files = req.files;
    req.body.user = req.user.id;
    await Lesson.create(req.body);
    res.redirect('/dashboard');
  }catch(e) {
    console.log(e);
    res.render('error/500');
  }
};

// @desc  Show/public lessons page
// @ met/route GET /
lessonCtrl.pLessons = async (req,res) => {
  try {
    const lessons = await Lesson.find({status : 'public'}).populate('user').lean();

    lessons.forEach(lesson => {
      let imge = "";
      if(lesson.user.avatar.link) {
        imge = lesson.user.avatar.link;
      }else {
        imge = "data:image/png;base64,"+lesson.user.avatar.buffer.toString('base64');
      }
      lesson.imge  = imge;
    });
    res.render('lessons/index',{
      lessons,
      user : req.user.toObject()
    })
  }catch(e){
    console.log(e);
    res.render('error/500');
  }
};


// @desc  Show/Adding a lesson page
// @ met/route GET /
lessonCtrl.add = (req,res) => {
  res.render('lessons/add');
};


// @desc  Show/ edit a lesson page
// @ met/route GET /edit/:id
lessonCtrl.editL = async (req,res) => {
  try {
    const lesson = await Lesson.findOne({
      _id : req.params.id
    }).lean();
    if(!lesson){
      res.render('error/404');
    }
    if(lesson.user != req.user.id){
      return res.redirect('/lessons');
    }else{
      res.render('lessons/edit', {
        lesson
      });
    }
  }catch(e) {
    console.log(e);
    res.render('error/500');
  }
};

// @desc  Update/Update a lesson
// @ met/route PUT lessons/:id
lessonCtrl.Lupdate = async (req,res) => {
  // console.log(req.body.delfiles);
  try{
    let lesson = await Lesson.findById(req.params.id).lean();
    if(!lesson) {
        return res.render('error/404');
    }
    if(lesson.user != req.user.id) {
      return res.redirect('/lessons');
    }else{
      req.body.files = req.files;
      req.body.user = req.user.id;
      const Oldfiles = lesson.files;
      let allFiles = Oldfiles.concat(req.body.files);
      if(req.body.delfiles) {
        allFiles = allFiles.filter(function(e) {
          return !req.body.delfiles.includes(e.originalname);
        });
      }
      req.body.files = allFiles;
      lesson = await Lesson.findOneAndUpdate(
        { _id : req.params.id },
        req.body,
        {
          new : true,
          runValidators : true,
        });
      res.redirect('/dashboard');
    }
  }catch(e){
    console.log(e);
    res.render('error/500');
  }
};

// @desc  DELETE/DELETE a lesson page
// @ met/route DELETE lessons/:id
lessonCtrl.Ldelete = async (req,res) => {
  try{
    await Lesson.remove({_id : req.params.id});
    res.redirect('/dashboard');
  }catch(e){
    res.render('error/500');
  }
};
module.exports = lessonCtrl;
