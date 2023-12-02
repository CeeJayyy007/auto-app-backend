const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./controller/user');
const authRouter = require('./controller/auth');
const app = express();

// Use body-parser middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api/users', usersRouter);
app.use('/api/', authRouter);
app.use('/api/', authRouter);

// middleware for testing purposes
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controller/testing');
  app.use('/api/testing', testingRouter);
}

module.exports = app;
