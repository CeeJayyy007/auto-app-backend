const { logger } = require('../config/logging');

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
