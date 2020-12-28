const User   = require('../models/User.js');
const bcrypt = require('bcryptjs');

const validPassword = async (email,password) => {
  console.log("test", email, password);
  const user = await User.findOne({email});
  console.log(user);
  const isValid = await bcrypt.compare(password,user.password);
  if(isValid) return true;
  return false;
}

module.exports = {
  validPassword
};
