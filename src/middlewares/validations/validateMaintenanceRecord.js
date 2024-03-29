const joi = require('joi');

const validateMaintenanceRecordIdSchema = joi.object({
  maintenanceRecordId: joi.number().required()
});

const validatePartialMaintenanceRecordSchema = joi.object({
  maintenanceRecordId: joi.number(),
  userId: joi.number(),
  date: joi.date(),
  status: joi.string(),
  note: joi.string(),
  updatedBy: joi.number(),
  deletedAt: joi.date(),
  serviceId: joi.array().items(joi.number()),
  inventoryId: joi.array().items(joi.number()),
  servicesQuantities: joi.object().pattern(joi.string(), joi.number()),
  inventoryQuantities: joi.object().pattern(joi.string(), joi.number()),
  discount: joi.object().pattern(joi.string(), joi.number()),
  services: joi.array().items(joi.string()),
  inventory: joi.array().items(joi.string())
});

const validateMaintenanceRecordsId = (req, res, next) => {
  const { error, value } = validateMaintenanceRecordIdSchema.validate(
    req.params
  );

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedMaintenanceRecordId = value;
  next();
};

const validatePartialMaintenanceRecord = (req, res, next) => {
  const { error, value } = validatePartialMaintenanceRecordSchema.validate(
    req.body
  );

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedPartialMaintenanceRecord = value;
  next();
};

module.exports = {
  validateMaintenanceRecordsId,
  validatePartialMaintenanceRecord
};
