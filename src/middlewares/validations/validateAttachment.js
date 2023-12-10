const joi = require('joi');

const validateAttachmentSchema = joi.object({
  name: joi.string().required(),
  filePath: joi.string().required(),
  description: joi.string()
});

const validateAttachmentIdSchema = joi.object({
  attachmentId: joi.number().required()
});

const validatePartialAttachmentSchema = joi.object({
  name: joi.string(),
  filePath: joi.string(),
  description: joi.string(),
  updatedBy: joi.number(),
  deletedAt: joi.date()
});

const validateAttachment = (req, res, next) => {
  const { error, value } = validateAttachmentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedData = value;
  next();
};

const validateAttachmentId = (req, res, next) => {
  const { error, value } = validateAttachmentIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedAttachmentId = value;
  next();
};

const validatePartialAttachment = (req, res, next) => {
  const { error, value } = validatePartialAttachmentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  req.validatedPartialAttachment = value;
  next();
};

module.exports = {
  validateAttachment,
  validateAttachmentId,
  validatePartialAttachment
};
