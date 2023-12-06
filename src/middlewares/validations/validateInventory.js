const joi = require('joi');

const validateInventorySchema = joi.object({
  name: joi.string().required(),
  quantity: joi.number().required(),
  lowLevel: joi.number().required(),
  initialPrice: joi.number().required(),
  markUp: joi.number().required()
});

const validateInventoryIdSchema = joi.object({
  inventoryId: joi.number().required()
});

const validateInventory = (req, res, next) => {
  const { error, value } = validateInventorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedData = value;
  next();
};

const validateInventoryId = (req, res, next) => {
  const { error, value } = validateInventoryIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedInventoryId = value;
  next();
};

module.exports = { validateInventory, validateInventoryId };
