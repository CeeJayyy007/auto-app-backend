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
  const { userId } = req.params;

  // check if appointment exists
  const appointments = await Appointment.findAll({
    where: { userId: userId },
    include: [
      {
        model: Service,
        attributes: ['id', 'name', 'description', 'price', 'avatar']
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
      },
      {
        model: Vehicle,
        attributes: ['id', 'make', 'model', 'year', 'registrationNumber']
      }
    ]
  });

  if (!appointments) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  res.status(200).json({ appointments, message: 'Appointment found' });
};

// Get a appointment and the user associated with it
const getAppointmentAndUser = async (req, res) => {
  const { appointmentId } = req.validatedAppointmentId;

  // check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId);

  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const user = await appointment.getUser();

  res.status(200).json({ appointment, user, message: 'Appointment found' });
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
  const { appointmentId, serviceId, vehicleId } =
    req.validatedPartialAppointment;
  const user = req.user;
  const appointmentStatus = 'approved';

  // check if user has authorization to create service request
  checkUserRole(['admin', 'superAdmin'], user, res);

  // check that vehicle belongs to user
  const vehicle = await user.getVehicles({
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

  // add services to appointment
  attachServices(newAppointment, serviceId, res);

  // create service request if appointment does not exist
  if (!appointment) {
    // create appointment
    const newAppointment = await Appointment.create({
      ...req.validatedPartialAppointment,
      status: appointmentStatus,
      serviceId: serviceId,
      date: new Date(),
      userId: user.id
    });

    // create maintenance record
    const newMaintenanceRecord = await MaintenanceRecord.create({
      ...newAppointment,
      vehicleId: newAppointment.vehicleId,
      appointmentId: newAppointment.id,
      serviceId: newAppointment.serviceId,
      description: newAppointment.note,
      userId: user.id
    });

    res.status(201).json({
      maintenanceRecord: newMaintenanceRecord,
      appointment: newAppointment,
      message: 'Service request created successfully'
    });
  }

  // add services to appointment
  attachServices(appointment, serviceId, res);

  // create service request with existing appointment
  const newAppointment = await appointment.update({
    ...appointment,
    status: appointmentStatus,
    updatedBy: user.id
  });

  // create maintenance record
  const newMaintenanceRecord = await MaintenanceRecord.create({
    ...newAppointment,
    startDate: newAppointment.date,
    description: newAppointment.note,
    vehicleId: newAppointment.vehicleId,
    appointmentId: newAppointment.id,
    serviceId: newAppointment.serviceId,
    userId: user.id
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

  res.status(204).json({ message: 'Appointment deleted successfully' });
};

module.exports = {
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentAndUser,
  createServiceRequest
};
