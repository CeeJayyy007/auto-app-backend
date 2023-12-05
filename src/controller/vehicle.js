const Vehicle = require('../models/vehicle');

// Get all vehicles
const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.status(200).json(vehicles);
};

// Get a specific vehicle by ID
const getVehicleById = async (req, res) => {
  const { vehicleId } = req.params;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  res.status(200).json(vehicle);
};

// Get a vehicle and the user associated with it
const getVehicleAndUser = async (req, res) => {
  const { vehicleId } = req.params;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  const user = await vehicle.getUser();

  res.status(200).json({ vehicle, user });
};

// Update a vehicle by ID
const updateVehicle = async (req, res) => {
  const { vehicleId } = req.params;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  // Update the vehicle
  const [updatedRows] = await Vehicle.update(req.body, {
    where: { id: vehicleId }
  });

  res.status(200).json(updatedRows);
};

// Delete a vehicle by ID
const deleteVehicle = async (req, res) => {
  const { vehicleId } = req.params;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  // Delete the vehicle
  await vehicle.destroy();
  res.status(204).send();
};

module.exports = {
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicleAndUser
};
