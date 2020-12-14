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


module.exports = {
  googleUserValidate
}
