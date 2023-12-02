const bcrypt = require('bcrypt');
const supertest = require('supertest');
const sequelize = require('../config/database');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');
const helper = require('./test_helper');

describe('when there is initially one user in the database', () => {
  let thisDb = sequelize;

  beforeEach(async () => {
    await thisDb.sync({ force: true });

    // Create a new user
    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@doe.com',
      password: passwordHash,
      phone: '+1234567890',
      avatar: null
    });

    // Save the new user to the User table
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'janedoe',
      email: 'jane@doe.com',
      password: 'password',
      phone: '+1234567800',
      avatar: null
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
