const mongoose = require('mongoose');
const User     = require('../../models/User');


const userOneId = new mongoose.Types.ObjectId();

const localUserOne = {
  _id      : userOneId,
  googleId : null,
  email    : "test1@test1.com",
  firstName : "",
  lastName : "",
  displayName : "",
  password : "test1",
  avatar : {
    link : "testlink"
  },
  role : "Contributor"
}

const setupUser = async () => {
  await User.deleteMany();
  // await new User(localUserOne).save();
}

module.exports = {
  userOneId,
  localUserOne,
  setupUser
};
