const joi = require('joi');

const validateAppointmentsSchema = joi.object({
  date: joi.date().required(),
  time: joi.string().required(),
  note: joi.string().required(),
  serviceRequest: joi.array().required()
});

const validateAppointmentsIdSchema = joi.object({
  appointmentId: joi.number().required()
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

module.exports = { validateAppointments, validateAppointmentsId };
