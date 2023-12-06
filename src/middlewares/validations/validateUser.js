const joi = require('joi');

const userIdSchema = joi.object({
  userId: joi.number().required()
});

const validateUserId = (req, res, next) => {
  const { error, value } = userIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedUserId = value;
  next();
};

module.exports = validateUserId;
