const bcrypt = require('bcrypt');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');

// Create a new user
const createUser = async (req, res) => {
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
};

// Create a new vehicle
const addUserVehicle = async (req, res) => {
  const { userId } = req.params;

  // check if user exists
  const existingUser = await User.findByPk(userId);

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Create a new vehicle
  const vehicle = await Vehicle.create({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    registration_number: req.body.registration_number,
    updatedBy: req.body.updatedBy,
    avatar: req.body.avatar,
    userId: userId
  });

  res.status(201).json(vehicle);
};

// Get all users
const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  const user = req.user;

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.status(200).json(user);
};

// Update a user by ID
const updateUser = async (req, res) => {
  const user = req.user;

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
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const user = req.user;

  const deletedRows = await User.destroy({
    where: { id: user.id }
  });
  if (deletedRows === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.status(200).json({ message: 'User deleted successfully' });

  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addUserVehicle
};
