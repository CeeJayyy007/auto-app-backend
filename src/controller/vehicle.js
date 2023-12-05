const Vehicle = require('../models/vehicle');

// Create a new vehicle
const createVehicle = async (req, res) => {
  const vehicle = await Vehicle.create({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    registration_number: req.body.registration_number,
    updatedBy: req.body.updatedBy,
    avatar: req.body.avatar,
    userId: req.user.id
  });

  res.status(201).json(vehicle);
};

// Get all vehicles
const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.status(200).json(vehicles);
};

// Get a specific vehicle by ID
const getVehicleById = async (req, res) => {
  const vehicle = req.vehicle;

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  res.status(200).json(vehicle);
};

// Get a vehicle and the user associated with it
const getVehicleAndUser = async (req, res) => {
  const vehicle = req.vehicle;

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  const user = await vehicle.getUser();
  res.status(200).json({ vehicle, user });
};

// Update a vehicle by ID
const updateVehicle = async (req, res) => {
  const vehicle = req.vehicle;

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  // Update the vehicle
  const [updatedRows] = await Vehicle.update(req.body, {
    where: { id: req.params.vehicleId }
  });

  res.status(200).json(updatedRows);
};

// Delete a vehicle by ID
const deleteVehicle = async (req, res) => {
  const vehicle = req.vehicle;

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  // Delete the vehicle
  await vehicle.destroy();
  res.status(204).send();
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleAndUser
};
