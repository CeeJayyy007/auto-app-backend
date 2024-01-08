const bcrypt = require('bcrypt');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const Appointment = require('../models/appointment');
const Inventory = require('../models/inventory');
const Service = require('../models/service');
const { checkUserRole } = require('../middlewares/authMiddleware');
const attachServices = require('./helpers/attachServices');

// Create a new user
const createUser = async (req, res) => {
  const { email, password, firstName, lastName, username, phone } =
    req.validatedData;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with the hashed password
  const newUser = await User.create({
    ...req.validatedData,
    password: hashedPassword,
    avatar: null // Set the avatar to null for now (add default avatar later)
  });

  res.status(201).json({ user: newUser });
};

// Create a new vehicle
const addUserVehicle = async (req, res) => {
  const { userId } = req.validatedUserId;
  const { registrationNumber } = req.validatedData;

  // check if user exists
  const existingUser = await User.findByPk(userId);

  if (!existingUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // check if vehicle exists
  const existingVehicle = await Vehicle.findOne({
    where: { registrationNumber: registrationNumber }
  });

  if (existingVehicle) {
    return res.status(409).json({ error: 'Vehicle already exists' });
  }

  // Create a new vehicle
  const vehicle = await Vehicle.create({
    ...req.validatedData,
    avatar: null, // Set the avatar to null for now (add default avatar later)
    userId: userId
  });

  res.status(201).json({
    vehicle,
    user: existingUser,
    message: 'Vehicle added successfully!'
  });
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { date, time, vehicleId, serviceId } = req.validatedData;
  const user = req.user;

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  checkUserRole(['user'], user, res);

  // check that vehicle belongs to user
  const vehicle = await user.getVehicles({
    where: { id: vehicleId }
  });

  if (!vehicle[0]) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  // check if all service exists
  const service = await Service.findAll({
    where: { id: serviceId }
  });

  if (!service[0]) {
    return res.status(404).json({ error: 'Service not found' });
  }

  // check if appointment exists
  const existingAppointment = await Appointment.findOne({
    where: {
      date: date,
      time,
      vehicleId: vehicleId,
      serviceId: serviceId,
      userId: user.id
    }
  });

  if (existingAppointment) {
    return res.status(409).json({ error: 'Appointment already exists' });
  }

  // limit number of appointments to 3 per day (fix this later)
  const appointments = await Appointment.findAll({
    where: { date: date, time: time, vehicleId: vehicleId, userId: user.id }
  });

  if (appointments.length >= 3) {
    return res
      .status(409)
      .json({ error: 'Appointment limit reached for this day' });
  }

  // convert date to ISO string format
  const originalDate = new Date(req.validatedData.date);

  // Create a new appointment
  const appointment = await Appointment.create({
    ...req.validatedData,
    date: originalDate.toISOString(),
    userId: user.id,
    vehicleId: vehicleId
  });

  // attach services to appointment
  attachServices(appointment, serviceId);

  res.status(201).json({ appointment, vehicle, user });
};

// Create a new inventory
const createInventory = async (req, res) => {
  const { name } = req.validatedData;
  const user = req.user;

  // check user role
  checkUserRole(['admin', 'superAdmin'], user, res);

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

  res.status(201).json(inventory, user);
};

// Create a new service
const createService = async (req, res) => {
  const { name } = req.validatedData;
  const user = req.user;

  // check user role
  checkUserRole(['admin', 'superAdmin'], user, res);

  // check if service exists
  const existingService = await Service.findOne({
    where: { name: name }
  });

  if (existingService) {
    return res.status(409).json({ error: 'Service already exists' });
  }

  // Create a new service
  const newService = await Service.create({
    ...req.validatedData,
    userId: user.id
  });

  res.status(201).json({ service: newService });
};

// Get all users
const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findAll({
    where: { id: userId },
    include: [
      {
        model: Service
      },
      {
        model: Appointment
      },
      {
        model: Vehicle
      }
    ]
  });

  if (!user || user.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.status(200).json({
    user,
    message: 'User and their details found sucessfully!'
  });
};

// Update a user by ID
const updateUser = async (req, res) => {
  const user = req.user;

  const { password, roles, permissions } = req.validatedPartialUser;

  // Hash the new password before updating (if provided)
  if (password) {
    password = await bcrypt.hash(password, 10);
  }

  const isSuperAdmin = checkUserRole(['superAdmin'], user, res);

  // if user is not superadmin, they can not update roles or permissions
  if (!isSuperAdmin) {
    if (roles || permissions) {
      return res.status(401).json({
        error: 'You are not authorized to update roles or permissions'
      });
    }
  }

  // Update the user
  const [updatedRows] = await User.update(
    { ...req.validatedPartialUser, updatedBy: user.id },
    {
      where: { id: user.id },
      returning: true
    }
  );

  if (updatedRows === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Get the updated user record
  const updatedUser = await User.findByPk(user.id);

  res.status(200).json({ user: updatedUser, message: 'User updated' });
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

  res.status(200).send();
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addUserVehicle,
  createAppointment,
  createInventory,
  createService
};
