const { logger } = require('../config/logging');
const chalk = require('chalk');

// add error handler middleware
const errorHandler = (error, request, response, next) => {
  console.log(chalk.green('errorHandler.js error.name: ', error.name));

  if (error instanceof CastError) {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error instanceof ValidationError) {
    return response.status(400).json({ error: error.message });
  } else if (error instanceof JsonWebTokenError) {
    return response.status(401).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    });
  }

  logger.error(error.message);

  response.status(500).json({ error: 'Internal Server Error' });

  next(error);
};

module.exports = errorHandler;
