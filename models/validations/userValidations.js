const Joi = require('joi');
//Defined roles
const roles     = Object.keys(require('../../_helpers/role.js'));

/*
==== google user fields ===========
  googleId : string
  firstName : string
  lastName : string
  displayName : string
  avatar : {
    link : String
  }
=======================
*/
const googleUserValidate = Joi.object({
  googleId : Joi.string()
                .alphanum()
                .required(),
  firstName: Joi.string()
                .alphanum()
                .required(),
  lastName : Joi.string()
                .alphanum()
                .required(),
  displayName : Joi.string()
                   .required(),
  avatar : Joi.string(),
  role   : Joi.string().required()
});

const RegisterValidationSchema = Joi.object({
  email : Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  firstName: Joi.string()
                .alphanum()
                .required(),
  lastName : Joi.string()
                .alphanum()
                .required(),
  displayName : Joi.string()
                .required(),
  password : Joi.string()
                .required(),
  avatar : Joi.string(),
  role   : Joi.string().required()
});

const LoginValidationSchema = Joi.object({
  email : Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password : Joi.string().min(6).required(),
});

module.exports = {
  googleUserValidate,
  RegisterValidationSchema,
  LoginValidationSchema
}

// .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','ma'] } }),
