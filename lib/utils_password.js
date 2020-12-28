const User   = require('../models/User.js');
const bcrypt = require('bcryptjs');

const validPassword = async (email,password) => {
  const user = await User.findOne({email});
  const isValid = await bcrypt.compare(password,user.password);
  if(isValid) return true;
  return false;
}

module.exports = {
  validPassword
};
