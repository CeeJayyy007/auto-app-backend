const Joi = require('joi');

const vehicleSchema = Joi.object({
  make: Joi.string().min(3).max(30).required(),
  model: Joi.string().min(3).max(30).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
  registration_number: Joi.string().min(3).max(9).required(),
  avatar: Joi.string().allow(null)
});

const vehicleIdSchema = Joi.object({
  vehicleId: Joi.number().required()
});

const validatePartialVehicleSchema = Joi.object({
  make: Joi.string().min(3).max(30),
  model: Joi.string().min(3).max(30),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
  registration_number: Joi.string().min(3).max(9),
  avatar: Joi.string(),
  updatedBy: Joi.number(),
  deletedAt: Joi.date()
});

const validateVehicle = (req, res, next) => {
  const { error, value } = vehicleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedData = value;
  next();
};

const validateVehicleId = (req, res, next) => {
  const { error, value } = vehicleIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedVehicleId = value;
  next();
};

const validatePartialVehicle = (req, res, next) => {
  const { error, value } = validatePartialVehicleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedPartialVehicle = value;
  next();
};

module.exports = { validateVehicle, validateVehicleId, validatePartialVehicle };
