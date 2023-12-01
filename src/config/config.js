require('dotenv').config();

const PORT = process.env.PORT || 3000;

let DB_NAME;
let DB_USER;
let DB_PASSWORD;
let DB_HOST;
let DB_PORT;

if (process.env.NODE_ENV === 'test') {
  DB_NAME = process.env.DB_NAME_TEST;
  DB_USER = process.env.DB_USER_TEST;
  DB_PASSWORD = process.env.DB_PASSWORD_TEST;
  DB_HOST = process.env.DB_HOST_TEST;
  DB_PORT = process.env.DB_PORT_TEST;
} else {
  DB_NAME = process.env.DB_NAME;
  DB_USER = process.env.DB_USER;
  DB_PASSWORD = process.env.DB_PASSWORD;
  DB_HOST = process.env.DB_HOST;
  DB_PORT = process.env.DB_PORT;
}

module.exports = {
  DB_NAME,
  PORT,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
};
