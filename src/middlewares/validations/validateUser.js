const joi = require('joi');

const validateUserIdSchema = joi.object({
  userId: joi.number().required()
});

const validatePartialUserSchema = joi.object({
  firstName: joi.string().min(3).max(30),
  lastName: joi.string().min(3).max(30),
  username: joi.string().min(3).max(30),
  email: joi.string().email(),
  phone: joi.string().min(10).max(15),
  avatar: joi.string(),
  roles: joi.string().allow('Admin', 'Super Admin', 'User'),
  permissions: joi.string(),
  password: joi.string().min(8),
  updatedBy: joi.number(),
  deletedAt: joi.date()
});

const validateUserId = (req, res, next) => {
  const { error, value } = validateUserIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedUserId = value;
  next();
};

const validatePartialUser = (req, res, next) => {
  const { error, value } = validatePartialUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedPartialUser = value;
  next();
};

module.exports = { validateUserId, validatePartialUser };
