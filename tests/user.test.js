const request = require('supertest');
const app     = require('../app');
const User    = require('../models/User');


jest.useFakeTimers();

const  {
  userOneId,
  localUserOne,
  setupUser
} = require('./fixtures/Tuser.js');

beforeEach(setupUser);

//Sign-Up
test('Should signUp a new user', async () => {
  await request(app).post('/auth/register')
  .attach('avatar','tests/fixtures/blackpara.png')
  .field('email',"emailTest@hotmail.com")
  .field('firstName',"test1")
  .field('lastName',"test1lastname")
  .field('displayName',"test test")
  .field('password',"passwordqsdqsd")
  .field('role', "Contributor")
  .expect(201)
});
