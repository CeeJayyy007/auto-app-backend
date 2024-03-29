const MaintenanceRecord = require('../models/maintenanceRecord');
const Appointment = require('../models/appointment');
const Attachment = require('../models/attachment');
const Service = require('../models/service');
const Vehicle = require('../models/vehicle');
const Inventory = require('../models/inventory');
const { checkUserRole } = require('../middlewares/authMiddleware');
const attachServices = require('./helpers/attachServices');
const attachInventory = require('./helpers/attachInventory');
const User = require('../models/user');
const { where } = require('sequelize');

// Get all maintenance records
const getMaintenanceRecords = async (req, res) => {
  const maintenanceRecords = await MaintenanceRecord.findAll();

  // return all maintenance records for user with associated serviceId and vehiclesId
  const maintenanceRecordsDetails = await Promise.all(
    maintenanceRecords.map(async (record) => {
      const { serviceId, vehicleId, inventoryId, ...rest } = record.get({
        plain: true
      });

      let service = [];
      let inventory = [];

      if (serviceId.length !== 0) {
        service = await Service.findAll({
          where: { id: serviceId },
          attributes: ['id', 'name', 'price'],
          raw: true
        });
      }

      if (inventoryId.length !== 0) {
        inventory = await Inventory.findAll({
          where: { id: inventoryId },
          attributes: ['id', 'name', 'finalPrice'],
          raw: true
        });
      }

      const vehicle = await Vehicle.findByPk(vehicleId, {
        attributes: ['id', 'make', 'model', 'year', 'registrationNumber'],
        raw: true
      });

      return {
        ...rest,
        serviceId,
        vehicleId,
        inventoryId,
        servicesDetails: service,
        vehicleDetails: vehicle,
        inventoryDetails: inventory
      };
    })
  );

  res.status(200).json(maintenanceRecordsDetails);
};

// Get a specific maintenance record by ID
const getMaintenanceRecordById = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;

  // check if maintenance record exists
  const maintenanceRecord =
    await MaintenanceRecord.findByPk(maintenanceRecordId);

  if (!maintenanceRecord) {
    res.status(404).json({ error: 'Maintenance record not found' });
    return;
  }

  const { serviceId, vehicleId, inventoryId, userId, ...rest } =
    maintenanceRecord.get({
      plain: true
    });

  let serviceData = [];
  let inventoryData = [];

  if (serviceId.length !== 0) {
    serviceData = await Service.findAll({
      where: { id: serviceId },
      attributes: ['id', 'name', 'price'],
      raw: true
    });
  }

  if (inventoryId.length !== 0) {
    inventoryData = await Inventory.findAll({
      where: { id: inventoryId },
      attributes: ['id', 'name', 'finalPrice'],
      raw: true
    });
  }

  const vehicle = await Vehicle.findByPk(vehicleId, {
    attributes: ['id', 'make', 'model', 'year', 'registrationNumber'],
    raw: true
  });

  const userDetails = await User.findByPk(userId, {
    attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
    raw: true
  });

  const services = serviceData.map((item) => item.name);
  const inventory = inventoryData.map((item) => item.name);

  const maintenanceRecordsDetails = {
    ...rest,
    serviceId,
    vehicleId,
    inventoryId,
    servicesDetails: serviceData,
    vehicleDetails: vehicle,
    services,
    inventory,
    inventoryDetails: inventoryData,
    userDetails: userDetails
  };

  res.status(200).json(maintenanceRecordsDetails);
};

// Get a maintenance record and the user associated with it
const getMaintenanceRecordAndUser = async (req, res) => {
  const { userId } = req.params;

  // find all maintenance records for user
  const userRecords = await MaintenanceRecord.findAll({
    where: { userId: userId }
  });

  if (!userRecords) {
    return res.status(404).json({ error: 'Activities records not found' });
  }

  // return all maintenance records for user with associated serviceId and vehiclesId
  const userRecordsDetails = await Promise.all(
    userRecords.map(async (record) => {
      const { serviceId, vehicleId, inventoryId, ...rest } = record.get({
        plain: true
      });

      let service = [];
      let inventory = [];

      if (serviceId.length !== 0) {
        service = await Service.findAll({
          where: { id: serviceId },
          attributes: ['id', 'name', 'price'],
          raw: true
        });
      }

      if (inventoryId.length !== 0) {
        inventory = await Inventory.findAll({
          where: { id: inventoryId },
          attributes: ['id', 'name', 'finalPrice'],
          raw: true
        });
      }

      const vehicle = await Vehicle.findByPk(vehicleId, {
        attributes: ['id', 'make', 'model', 'year', 'registrationNumber'],
        raw: true
      });

      const user = await User.findByPk(userId, {
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        raw: true
      });

      return {
        ...rest,
        serviceId,
        vehicleId,
        inventoryId,
        servicesDetails: service,
        vehicleDetails: vehicle,
        inventoryDetails: inventory,
        userDetails: user
      };
    })
  );

  res.status(200).json(userRecordsDetails);
};

// Update a maintenance record by ID
const updateMaintenanceRecord = async (req, res) => {
  const { maintenanceRecordId } = req.validatedMaintenanceRecordId;
  const {
    status: appointmentStatus,
    serviceId,
    inventoryId,
    inventoryQuantities
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
  if (appointmentStatus === 'Completed' || 'Cancelled') {
    // Update the appointment
    const [updatedRows] = await Appointment.update(
      { status: 'Completed', updatedBy: user.id, serviceId: serviceId },
      {
        where: { id: appointment.id }
      }
    );

    if (updatedRows === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
  }

  // update inventory by deducting used inventory items
  if (inventoryId.length !== 0) {
    const inventory = await Inventory.findAll({
      where: { id: inventoryId },
      raw: true
    });

    await Promise.all(
      inventory.map(async (inventory) => {
        // check that the inventory quantity is not less than the quantity used
        if (inventory.quantity < inventoryQuantities[inventory.name]) {
          res.status(400).json({
            error: `The quantity of ${inventory.name} is insufficient for this maintenance record. Available quantity is ${inventory.quantity}`
          });
          return;
        }

        const updatedInventory = await Inventory.update(
          {
            quantity: inventory.quantity - inventoryQuantities[inventory.name]
          },
          {
            where: { id: inventory.id }
          }
        );

        if (!updatedInventory) {
          res.status(500).json({ error: 'Error updating inventory' });
          return;
        }
        return updatedInventory;
      })
    );
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
