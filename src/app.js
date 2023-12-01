const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const { DataTypes } = require('sequelize');

const app = express();

// Use body-parser middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// home
app.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

module.exports = app;
