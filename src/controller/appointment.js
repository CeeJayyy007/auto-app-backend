const { checkUserRole } = require('../middlewares/authMiddleware');
const Appointment = require('../models/appointment');
const MaintenanceRecord = require('../models/maintenanceRecord');
const Service = require('../models/service');
const User = require('../models/user');
const Vehicle = require('../models/vehicle');
const attachServices = require('./helpers/attachServices');

// Get all appointments
const getAppointments = async (req, res) => {
  const appointments = await Appointment.findAll();
  res.status(200).json(appointments);
};

// Get a specific appointment by ID
const getAppointmentById = async (req, res) => {
  const { appointmentId } = req.validatedAppointmentId;

  // check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId);

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  res.status(200).json({ appointment, message: 'Appointment found' });
};

// Get a appointment and the user associated with it
const getAppointmentAndUser = async (req, res) => {
  const { userId } = req.params;

  // check if appointment exists
  const appointments = await Appointment.findAll({
    where: { userId: userId },
    include: [
      {
        model: Service
      },
      {
        model: User
      },
      {
        model: Vehicle
      }
    ]
  });

  if (!appointments) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  res.status(200).json({ appointments, message: 'Appointment found' });
};

// Update an appointment by ID
const updateAppointment = async (req, res) => {
  const { appointmentId } = req.validatedAppointmentId;
  const { serviceId } = req.validatedPartialAppointment;
  const user = req.user;

  // check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId);

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // check if user matches user that created appointment
  if (appointment.userId !== user.id) {
    res
      .status(401)
      .json({ error: 'You are not authorized to update this appointment' });
    return;
  }

  // check if appointment is not pending and reject any additional updates
  if (appointment.status !== 'Pending') {
    res.status(401).json({
      error: "You can not update an appointment once it's no longer pending"
    });
    return;
  }

  // update appointment services
  attachServices(appointment, serviceId, res);

  // Update the appointment
  const [updatedRows] = await Appointment.update(
    { ...req.validatedPartialAppointment, updatedBy: user.id },
    {
      where: { id: appointmentId }
    }
  );

  if (updatedRows === 0) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // Get the updated appointment record
  const updatedAppointment = await Appointment.findByPk(appointmentId);

  res.status(200).json({
    appointment: updatedAppointment,
    message: 'Appointment updated successfully'
  });
};

// create service request
const createServiceRequest = async (req, res) => {
  const {
    appointmentId,
    serviceId,
    vehicleId,
    userId: appointmentUserId
  } = req.validatedPartialAppointment;
  const user = req.user;
  const appointmentStatus = 'In-Progress';

  // check if user has authorization to create service request
  const isAdminOrSuperAdmin = checkUserRole(
    ['Admin', 'Super Admin'],
    user,
    res
  );

  if (!isAdminOrSuperAdmin) {
    return res.status(401).json({
      error: 'You are not authorized to create a service request'
    });
  }

  // check that appointment user exists and vehicle belongs to user
  const appointmentUser = await User.findByPk(appointmentUserId);

  if (!appointmentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const vehicle = await appointmentUser.getVehicles({
    where: { id: vehicleId }
  });

  if (!vehicle[0]) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  // check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: Service
      }
    ]
  });

  // create service request if appointment does not exist
  if (!appointment) {
    // create appointment
    const newAppointment = await Appointment.create({
      ...req.validatedPartialAppointment,
      status: appointmentStatus,
      serviceId: serviceId,
      date: new Date(),
      userId: appointmentUserId,
      updatedBy: user.id
    });

    // add services to appointment
    attachServices(newAppointment, serviceId, res);

    // create maintenance record
    const newMaintenanceRecord = await MaintenanceRecord.create({
      ...newAppointment,
      vehicleId: newAppointment.vehicleId,
      appointmentId: newAppointment.id,
      serviceId: newAppointment.serviceId,
      note: newAppointment.note,
      userId: appointmentUserId,
      updatedBy: user.id
    });

    res.status(201).json({
      maintenanceRecord: newMaintenanceRecord,
      appointment: newAppointment,
      message: 'Service request created successfully'
    });
  }

  // create service request with existing appointment
  const newAppointment = await appointment.update({
    ...appointment,
    status: appointmentStatus,
    updatedBy: user.id
  });

  // add services to appointment
  attachServices(newAppointment, serviceId, res);

  // create maintenance record
  const newMaintenanceRecord = await MaintenanceRecord.create({
    ...newAppointment,
    startDate: newAppointment.date,
    note: newAppointment.note,
    vehicleId: newAppointment.vehicleId,
    appointmentId: newAppointment.id,
    serviceId: newAppointment.serviceId,
    userId: newAppointment.userId,
    updatedBy: user.id
  });

  res.status(201).json({
    maintenanceRecord: newMaintenanceRecord,
    appointment: newAppointment,
    message: 'Service request created successfully'
  });
};

// Delete an appointment by ID
const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.validatedAppointmentId;

  // check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId);

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // Delete the appointment
  await Appointment.destroy({
    where: { id: appointmentId }
  });

  res.status(204).send();
};

module.exports = {
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentAndUser,
  createServiceRequest
};
