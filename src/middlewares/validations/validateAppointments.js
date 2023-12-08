const joi = require('joi');

const validateAppointmentsSchema = joi.object({
  date: joi.date().required(),
  note: joi.string().required(),
  vehicleId: joi.number().required(),
  serviceId: joi.array().items(joi.number()).required()
});

const validateAppointmentsIdSchema = joi.object({
  appointmentId: joi.number().required()
});

const validatePartialAppointmentSchema = joi.object({
  appointmentId: joi.number(),
  date: joi.date(),
  note: joi.string(),
  vehicleId: joi.number(),
  status: joi.string(),
  updatedBy: joi.number(),
  serviceId: joi.array().items(joi.number()),
  deletedAt: joi.date()
});

const validateAppointments = (req, res, next) => {
  const { error, value } = validateAppointmentsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedData = value;
  next();
};

const validateAppointmentsId = (req, res, next) => {
  const { error, value } = validateAppointmentsIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedAppointmentId = value;
  next();
};

const validatePartialAppointment = (req, res, next) => {
  const { error, value } = validatePartialAppointmentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedPartialAppointment = value;
  next();
};

module.exports = {
  validateAppointments,
  validateAppointmentsId,
  validatePartialAppointment
};
