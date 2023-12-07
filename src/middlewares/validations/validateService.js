const joi = require('joi');

const validateServiceSchema = joi.object({
  name: joi.string().required().error(new Error('Name is required')),
  price: joi.number().required().error(new Error('Price is required')),
  description: joi
    .string()
    .required()
    .error(new Error('Description is required'))
});

const validateServiceIdSchema = joi.object({
  serviceId: joi.number().required().error(new Error('Service Id is required'))
});

const validatePartialServiceSchema = joi.object({
  name: joi.string(),
  price: joi.number(),
  description: joi.string(),
  avatar: joi.string(),
  updatedBy: joi.number(),
  deletedAt: joi.date()
});

const validateService = (req, res, next) => {
  const { error, value } = validateServiceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedData = value;
  next();
};

const validateServiceId = (req, res, next) => {
  const { error, value } = validateServiceIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedServiceId = value;
  next();
};

const validatePartialService = (req, res, next) => {
  const { error, value } = validatePartialServiceSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedPartialService = value;
  next();
};

module.exports = { validateService, validateServiceId, validatePartialService };
