const { checkUserRole } = require('../middlewares/authMiddleware');
const Appointment = require('../models/appointment');
const MaintenanceRecord = require('../models/maintenanceRecord');
const Service = require('../models/service');
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
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: Service
      }
    ]
  });

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.status(200).json(appointment);
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

  res.status(200).json({ appointment, user });
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

  // update appointment services
  attachServices(updatedAppointment, serviceId);

  res.status(200).json({
    appointment: updatedAppointment,
    message: 'Appointment updated successfully'
  });
};

// create service request
const createServiceRequest = async (req, res) => {
  const { appointmentId, serviceId } = req.validatedPartialAppointment;
  const user = req.user;
  const appointmentStatus = 'approved';

  console.log('user', user);

  // check if user has authorization to create service request
  checkUserRole(['admin', 'superAdmin'], user, res);

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
      date: new Date(),
      userId: user.id
    });

    // add services to appointment
    attachServices(newAppointment, serviceId);

    // create maintenance record
    const newMaintenanceRecord = await MaintenanceRecord.create({
      ...newAppointment,
      appointmentId: newAppointment.id,
      userId: user.id
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
  attachServices(newAppointment, serviceId);

  // create maintenance record
  const newMaintenanceRecord = await MaintenanceRecord.create({
    startDate: newAppointment.date,
    description: newAppointment.note,
    vehicleId: newAppointment.vehicleId
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
