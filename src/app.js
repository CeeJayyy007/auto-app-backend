const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./controller/user');
const app = express();

// Use body-parser middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/api/users', usersRouter);

module.exports = app;
