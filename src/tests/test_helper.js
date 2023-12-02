const User = require('../models/user');

const initialUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@doe.com',
    password: 'password',
    phone: '+1234567890',
    avatar: null
  },
  {
    firstName: 'Jack',
    lastName: 'Daniel',
    username: 'JackDaniel',
    email: 'jack@daniel.com',
    password: 'testing',
    phone: '+1234567800',
    avatar: null
  }
];

const usersInDb = async () => {
  const users = await User.findAll();

  return users.map((user) => user.toJSON());
};

module.exports = {
  initialUsers,
  usersInDb
};
