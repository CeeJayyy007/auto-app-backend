const MaintenanceRecord = require('../models/maintenanceRecord');
const Appointment = require('../models/appointment');
const Vehicle = require('../models/vehicle');
const Inventory = require('../models/inventory');
const User = require('../models/user');
const Service = require('../models/service');
const { checkUserRole } = require('../middlewares/authMiddleware');

// Get all maintenance records
const getMaintenanceRecords = async (req, res) => {
  const maintenanceRecords = await MaintenanceRecord.findAll();
  res.status(200).json(maintenanceRecords);
};

// Get a specific maintenance record by ID
const getMaintenanceRecordById = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;
  const user = req.user;

  // check user role
  checkUserRole(['admin', 'superAdmin'], user, res);

  // check if maintenance record exists
  const maintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  if (!maintenanceRecord) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  res.status(200).json(maintenanceRecord);
};

// Get a maintenance record and the user associated with it
const getMaintenanceRecordAndUser = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;

  // check user role
  checkUserRole(['admin', 'superAdmin'], user, res);

  // check if maintenance record exists
  const maintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  if (!maintenanceRecord) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  const user = await maintenanceRecord.getUser();

  res.status(200).json({ maintenanceRecord, user });
};

// Update a maintenance record by ID
const updateMaintenanceRecord = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;
  const { status } = req.validatedPartialMaintenanceRecord;
  const user = req.user;

  // check user role
  checkUserRole(['admin', 'superAdmin'], user, res);

  // check if maintenance record exists
  const maintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  if (!maintenanceRecord) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  const [updatedRows] = await MaintenanceRecord.update(
    {
      ...req.validatedPartialMaintenanceRecord
    },
    {
      where: { id: maintenanceRecordId }
    }
  );

  if (updatedRows === 0) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  // Get the updated maintenance record record
  const updatedMaintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  res.status(200).json({
    maintenanceRecord: updatedMaintenanceRecord,
    message: 'Maintenance record updated'
  });
};

// Delete a maintenance record by ID
const deleteMaintenanceRecord = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;
  const user = req.user;

  // check user role
  checkUserRole(['admin', 'superAdmin'], user, res);

  // check if maintenance record exists
  const maintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  if (!maintenanceRecord) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  // Delete the maintenance record
  await maintenanceRecord.destroy();

  res.status(204).end();
};

module.exports = {
  getMaintenanceRecords,
  getMaintenanceRecordById,
  getMaintenanceRecordAndUser,
  updateMaintenanceRecord,
  deleteMaintenanceRecord
};
