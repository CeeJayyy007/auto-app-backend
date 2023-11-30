const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Use body-parser middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sequelize configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Define a simple User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync the model with the database
sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// home
app.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

// Define a simple route to create a user
app.post('/create-user', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a user using the Sequelize model
    const newUser = await User.create({
      username,
      email,
      password
    });

    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express app
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
