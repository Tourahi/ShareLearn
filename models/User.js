const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId : {
    type     : String,
    default  : null
  },
  email : {
    type     : String,
    min      : 6,
    max      : 255
  },
  firstName: {
    type     : String,
  },
  lastName: {
    type     : String,
  },
  displayName: {
    type     : String,
  },
  password : {
    type     : String,
    min      : 6,
    max      : 1024
  },
  avatar : {
    buffer : Buffer,
    link   : String,
    ext    : String
  },
  role : {
    type     : String,
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

userSchema.pre('save' ,async function (next) {
  //TO-DO
  next();
});



module.exports = mongoose.model('User' , userSchema);
