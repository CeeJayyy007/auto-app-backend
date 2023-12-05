const appRoot = require('app-root-path');
const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const morgan = require('morgan');
require('winston-daily-rotate-file');

const options = {
  file: {
    level: 'error',
    filename: `${appRoot}/logs/app-error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    format: combine(timestamp(), json())
  },
  console: {
    level: process.env.LOG_LEVEL || 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: `${appRoot}/logs/combined-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  level: 'info',
  json: true,
  handleExceptions: true,
  handleRejections: true
});

const logger = winston.createLogger({
  format: combine(timestamp(), json()),
  exitOnError: false, // do not exit on handled exceptions
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
    fileRotateTransport
  ]
});

const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res))
    });
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => {
        const data = JSON.parse(message);
        logger.http('incoming-request', data);
      }
    }
  }
);

module.exports = { logger, morganMiddleware };
