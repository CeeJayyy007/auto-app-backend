const { logger } = require('../config/logging');

// add error handler middleware
// const errorHandler = (error, request, response, next) => {
//   logger.error(error.message);

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' });
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message });
//   } else if (error.name === 'JsonWebTokenError') {
//     return response.status(401).json({ error: error.message });
//   } else if (error.name === 'TokenExpiredError') {
//     return response.status(401).json({
//       error: 'token expired'
//     });
//   }

//   response.status(500).json({ error: 'Internal Server Error' });

//   next(error);
// };

const errorHandler = (error, _, res, __) => {
  // render the error page
  logger.log({
    level: 'error',
    message: error?.data?.error ?? error?.data?.message ?? error.message
  });

  const code = error.code || error.status || 500;

  res.status(code).json({
    success: false,
    statusCode: code,
    data: {
      error: error?.data?.error ?? error?.data?.message ?? error.message
    }
  });
};

module.exports = errorHandler;
