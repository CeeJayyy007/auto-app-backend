const joi = require('joi');

const validateInventorySchema = joi.object({
  name: joi.string().required(),
  quantity: joi.number().required(),
  lowLevel: joi.number().required(),
  initialPrice: joi.number().required(),
  finalPrice: joi.number().required()
});

const validateInventoryIdSchema = joi.object({
  inventoryId: joi.number().required()
});

const validatePartialInventorySchema = joi.object({
  name: joi.string(),
  quantity: joi.number(),
  lowLevel: joi.number(),
  initialPrice: joi.number(),
  finalPrice: joi.number(),
  updatedBy: joi.number(),
  deletedAt: joi.date()
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

const validatePartialInventory = (req, res, next) => {
  const { error, value } = validatePartialInventorySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedPartialInventory = value;
  next();
};

module.exports = {
  validateInventory,
  validateInventoryId,
  validatePartialInventory
};
