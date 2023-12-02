const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
usersRouter.use(bodyParser.json());
const User = require('../models/user');

// Create a new user
usersRouter.post('/', async (req, res) => {
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user with the hashed password
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      avatar: null // Set the avatar to null for now (add default avatar later)
    });

    // Exclude the password field from the response
    const userWithoutPassword = newUser.toJSON();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all users
usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific user by ID
usersRouter.get('/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a user by ID
usersRouter.put('/:userId', async (req, res) => {
  try {
    const existingUser = await User.findByPk(req.params.userId);

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Hash the new password before updating (if provided)
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user
    const [updatedRows] = await User.update(req.body, {
      where: { id: req.params.userId },
      returning: true
    });

    if (updatedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get the updated user record
    const updatedUser = await User.findByPk(req.params.userId);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a user by ID
usersRouter.delete('/:userId', async (req, res) => {
  try {
    const deletedRows = await User.destroy({
      where: { id: req.params.userId }
    });
    if (deletedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = usersRouter;
