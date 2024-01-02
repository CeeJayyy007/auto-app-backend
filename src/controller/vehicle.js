const Appointment = require('../models/appointment');
const Vehicle = require('../models/vehicle');

// Get all vehicles
const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.status(200).json({ vehicles, message: 'Vehicles found' });
};

// Get a specific vehicle by ID
const getVehicleById = async (req, res) => {
  const { vehicleId } = req.validatedVehicleId;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  res.status(200).json({ vehicle, message: 'Vehicle found' });
};

// Get a vehicle and the user associated with it
const getVehicleAndUser = async (req, res) => {
  const { vehicleId } = req.validatedVehicleId;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  const user = await vehicle.getUser();

  res.status(200).json({ vehicle, user, message: 'Vehicle found' });
};

// Update a vehicle by ID
const updateVehicle = async (req, res) => {
  const { vehicleId } = req.validatedVehicleId;
  const user = req.user;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  // Update the vehicle
  const [updatedRows] = await Vehicle.update(
    { ...req.validatedPartialVehicle, updatedBy: user.id },
    {
      where: { id: vehicleId }
    }
  );

  if (updatedRows === 0) {
    res.status(400).json({ error: 'No fields updated' });
    return;
  }

  // Get the updated vehicle
  const updatedVehicle = await Vehicle.findByPk(vehicleId);

  res.status(200).json({
    vehicle: updatedVehicle,
    message: 'Vehicle updated successfully'
  });
};

// Delete a vehicle by ID
const deleteVehicle = async (req, res) => {
  const { vehicleId } = req.validatedVehicleId;

  // check if vehicle exists
  const vehicle = await Vehicle.findByPk(vehicleId);

  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }

  // Check if there are related appointments
  const appointments = await Appointment.findAll({
    where: { vehicleId: vehicle.id }
  });

  if (appointments.length > 0) {
    res.status(401).json({
      error:
        'Cannot delete. There are appointments associated with this vehicle.'
    });
    return;
  }

  // If no related appointments, delete the vehicle
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
