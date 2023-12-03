const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./controller/user');
const authRouter = require('./controller/auth');
const app = express();
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { tokenExtractor } = require('./middlewares/authMiddleware');
const { morganMiddleware } = require('./config/logging');
const errorLogger = require('./middlewares/errorLogger');
const unknownEndpoint = require('./middlewares/util');
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combine', { stream: morganMiddleware.stream }));

app.use(tokenExtractor);

// routes
app.use('/api/users', usersRouter);
app.use('/api/', authRouter);
app.use('/api/', authRouter);

// middleware for testing purposes
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controller/testing');
  app.use('/api/testing', testingRouter);
}

// use unknown endpoint middleware
app.use(unknownEndpoint);

// use error handler middleware
// app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
