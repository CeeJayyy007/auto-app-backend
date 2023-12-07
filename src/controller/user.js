const bcrypt = require('bcrypt');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Appointment = require('../models/appointment');
const logger = require('../config/logging');
const Inventory = require('../models/inventory');
const { checkUserRole } = require('../middlewares/authMiddleware');
const e = require('express');

// Create a new user
const createUser = async (req, res) => {
  const { email, password, firstName, lastName, username, phone } =
    req.validatedData;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with the hashed password
  const newUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: hashedPassword,
    phone: phone,
    avatar: null // Set the avatar to null for now (add default avatar later)
  });

  res.status(201).json({ user: newUser });
};

// Create a new vehicle
const addUserVehicle = async (req, res) => {
  const { make, model, year, registration_number } = req.validatedData;
  const { userId } = req.validatedUserId;

  // check if user exists
  const existingUser = await User.findByPk(userId);

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Create a new vehicle
  const vehicle = await Vehicle.create({
    make: make,
    model: model,
    year: year,
    registration_number: registration_number,
    avatar: null, // Set the avatar to null for now (add default avatar later)
    userId: userId
  });

  res.status(201).json({ vehicle, user: existingUser });
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { date, serviceRequest, note, vehicleId } = req.validatedData;
  const { userId } = req.validatedUserId;
  const user = req.user;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // check that vehicle belongs to user
  const vehicle = await user.getVehicles({
    where: { id: vehicleId }
  });

  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  // check if appointment exists
  const existingAppointment = await Appointment.findOne({
    where: { date: date, vehicleId: vehicleId }
  });

  if (existingAppointment) {
    return res.status(409).json({ error: 'Appointment already exists' });
  }

  // limit number of appointments to 3 per day
  const appointments = await Appointment.findAll({
    where: { date: date }
  });

  if (appointments.length >= 3) {
    return res
      .status(409)
      .json({ error: 'Appointment limit reached for this day' });
  }

  // Create a new appointment
  const appointment = await Appointment.create({
    date: date,
    serviceRequest: serviceRequest,
    note: note,
    userId: userId,
    vehicleId: vehicleId
  });

  res.status(201).json({ appointment, vehicle, user });
};

// Create a new inventory
const createInventory = async (req, res) => {
  const { name } = req.validatedData;
  const user = req.user;

  // check user role
  checkUserRole(user, res);

  // check if inventory exists
  const existingInventory = await Inventory.findOne({
    where: { name: name }
  });

  if (existingInventory) {
    return res.status(409).json({ error: 'Inventory already exists' });
  }

  // Create a new inventory item
  const inventory = await Inventory.create({
    ...req.validatedData,
    userId: user.id
  });

  res.status(201).json(inventory);
};

// Get all users
const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  // check if user exists
  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.status(200).json(user);
};

// Update a user by ID
const updateUser = async (req, res) => {
  const user = req.user;

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
  const updatedUser = await User.findByPk(user.id);

  res.status(200).json(updatedUser);
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  // check if user exists
  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const deletedRows = await User.destroy({
    where: { id: user.id }
  });

  if (deletedRows === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json({ message: 'User deleted successfully' });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addUserVehicle,
  createAppointment,
  createInventory
};
