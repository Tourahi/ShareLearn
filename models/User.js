const mongoose  = require('mongoose');
const validator = require('validator');
//Defined roles
const roles     = Object.keys(require('../_helpers/role.js'));

const userSchema = new mongoose.Schema({
  googleId : {
    type     : String,
    default  : null
  },
  email : {
    type     : String,
    unique   : true,
    // required : true, tested befor the save action
    min      : 6,
    max      : 255,
    validate(val) {
      if(!validator.isEmail(val)) {
        throw new Error('Invalide email.');
      }
    }
  },
  firstName: {
    type     : String,
    required : true
  },
  displayName: {
    type     : String,
    required : true,
    unique   : true
  },
  lastName: {
    type     : String,
    required : true
  },
  password : {
    type     : String,
    required : true,
    min      : 6,
    max      : 1024
  },
  avatar : {
    buffer : Buffer,
    ext    : String
  },
  role : {
    type     : String,
    required : true,
    validate(val) {
      if (!roles.indexOf(val)) {
        throw new Error('Undifined role.');
      }
    }
  }
},{
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
});

userSchema.pre('save' ,async function (next) {

  next();
});


module.exports = mongoose.model('User' , userSchema);
