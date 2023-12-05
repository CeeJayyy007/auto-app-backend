const Appointment = require('../models/appointment');

// Get all appointments
const getAppointments = async (req, res) => {
  const appointments = await Appointment.findAll();
  res.status(200).json(appointments);
};

// Get a specific appointment by ID
const getAppointmentById = async (req, res) => {
  const { appointmentId } = req.params;

  // check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId);

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.status(200).json(appointment);
};

// Get a appointment and the user associated with it
const getAppointmentAndUser = async (req, res) => {
  const { appointmentId } = req.params;

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
  const { appointmentId } = req.params;

  // check if appointment exists
  const appointment = await Appointment.findByPk(appointmentId);

  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // check if user matches user that created appointment
  if (appointment.userId !== req.userId) {
    res
      .status(401)
      .json({ error: 'You are not authorized to update this appointment' });
    return;
  }

  // Update the appointment
  const [updatedRows] = await Appointment.update(req.body, {
    where: { id: appointmentId }
  });

  res.status(200).json(updatedRows);
};

// Delete an appointment by ID
const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;

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
  getAppointmentAndUser
};
