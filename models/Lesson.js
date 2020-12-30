const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
  type : String,
  required : true,
  trim    : true
  },
  body: {
    type : String,
    required : true
  },
  status: {
    type : String,
    default : 'public',
    enum    : ['public' , 'private']
  },
  files : [],
  user: {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User',
    required : true
  }
},{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
  timestamps: true
});

module.exports = mongoose.model('Lesson' , LessonSchema);
