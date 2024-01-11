const MaintenanceRecord = require('../models/maintenanceRecord');
const Appointment = require('../models/appointment');
const Attachment = require('../models/attachment');
const { checkUserRole } = require('../middlewares/authMiddleware');
const attachServices = require('./helpers/attachServices');
const attachInventory = require('./helpers/attachInventory');

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
  const isAdminOrSuperAdmin = checkUserRole(
    ['Admin', 'Super Admin'],
    user,
    res
  );

  if (!isAdminOrSuperAdmin) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to retrieve maintenance record' });
  }

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
  const isAdminOrSuperAdmin = checkUserRole(
    ['Admin', 'Super Admin'],
    user,
    res
  );

  if (!isAdminOrSuperAdmin) {
    return res
      .status(401)
      .json({
        error:
          'You are not authorized to retrieve maintenance record and user details'
      });
  }

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
  const {
    status: appointmentStatus,
    serviceId,
    inventoryId
  } = req.validatedPartialMaintenanceRecord;
  const user = req.user;

  // check user role
  const isAdminOrSuperAdmin = checkUserRole(
    ['Admin', 'Super Admin'],
    user,
    res
  );

  if (!isAdminOrSuperAdmin) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to update maintenance record' });
  }

  // check if maintenance record exists
  const maintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  if (!maintenanceRecord) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  // check if appointment exists
  const appointment = await Appointment.findByPk(
    maintenanceRecord.appointmentId
  );

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // if serviceId is provided, attach services to appointment
  if (serviceId) {
    attachServices(maintenanceRecord, serviceId, res);
  }

  // if inventoryId is provided, attach inventory to appointment
  if (inventoryId) {
    attachInventory(maintenanceRecord, inventoryId, res);
  }

  // if status is completed, update the appointment status to completed
  if (appointmentStatus === 'Completed') {
    // Update the appointment
    const [updatedRows] = await Appointment.update(
      { status: appointmentStatus, updatedBy: user.id, serviceId: serviceId },
      {
        where: { id: appointment.id }
      }
    );

    if (updatedRows === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
  }

  // Update the maintenance record
  const [updatedRows] = await MaintenanceRecord.update(
    {
      ...req.validatedPartialMaintenanceRecord,
      updatedBy: user.id
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

// create and add attachment to maintenance record
const createAttachment = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;
  const user = req.user;

  // check if maintenance record exists
  const maintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  if (!maintenanceRecord) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  // create attachment
  const attachment = await Attachment.create({
    ...req.validatedData,
    userId: user.id,
    maintenanceRecordId: maintenanceRecord.id
  });

  res
    .status(201)
    .json({ attachment, message: 'Attachment added successfully' });
};

// Delete a maintenance record by ID
const deleteMaintenanceRecord = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;
  const user = req.user;

  // check user role
  const isAdminOrSuperAdmin = checkUserRole(
    ['Admin', 'Super Admin'],
    user,
    res
  );

  if (!isAdminOrSuperAdmin) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to delete maintenance record' });
  }

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
  deleteMaintenanceRecord,
  createAttachment
};
