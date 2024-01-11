const Joi = require('joi');

const registrationSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(new Error('First Name is required')),
  lastName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .error(new Error('Last Name is required')),
  email: Joi.string().email().required().error(new Error('Email is required')),
  password: Joi.string()
    .min(8)
    .required()
    .error(new Error('Password is required')),
  phone: Joi.string()
    .min(10)
    .max(15)
    .required()
    .error(new Error('Phone is required'))
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().error(new Error('Email is required')),
  password: Joi.string()
    .min(8)
    .required()
    .error(new Error('Password is required'))
});

const validateRegistration = (req, res, next) => {
  const { error, value } = registrationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedData = value;
  next();
};

const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedData = value;
  next();
};

module.exports = { validateRegistration, validateLogin };
