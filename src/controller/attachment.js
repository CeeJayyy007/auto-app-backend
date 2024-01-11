const Attachment = require('../models/attachment');
const { checkUserRole } = require('../middlewares/authMiddleware');

// Get all attachments
const getAttachments = async (req, res) => {
  const attachments = await Attachment.findAll();
  res.status(200).json(attachments);
};

// Get a specific attachment by ID
const getAttachmentById = async (req, res) => {
  const { attachmentId } = req.validatedAttachmentId;
  const user = req.user;

  // check user role

  const isUser = checkUserRole(['Admin', 'SuperAdmin'], user, res);

  if (!isUser) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to create attachments' });
  }

  // check if attachment exists
  const attachment = await Attachment.findByPk(attachmentId);

  if (!attachment) {
    res.status(404).json({ error: 'Attachment not found' });
    return;
  }

  res.status(200).json({ attachment, message: 'Attachment found' });
};

// Update a attachment by ID
const updateAttachment = async (req, res) => {
  const { attachmentId } = req.validatedAttachmentId;
  const user = req.user;

  // check user role
  const isAdminOrSuperAdmin = checkUserRole(
    ['Admin', 'Super Admin'],
    user,
    res
  );

  if (!isAdminOrSuperAdmin) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to update attachments' });
  }

  // check if attachment exists
  const attachment = await Attachment.findByPk(attachmentId);

  if (!attachment) {
    res.status(404).json({ error: 'Attachment not found' });
    return;
  }

  const [updatedRows] = await Attachment.update(
    { ...req.validatedPartialAttachment, updatedBy: user.id },
    {
      where: { id: attachmentId }
    }
  );

  // check if attachment was updated
  if (updatedRows === 0) {
    res.status(404).json({ error: 'Attachment not found' });
    return;
  }

  const updatedAttachment = await Attachment.findByPk(attachmentId);

  res
    .status(200)
    .json({ attachment: updatedAttachment, message: 'Attachment updated' });
};

// Delete a attachment by ID
const deleteAttachment = async (req, res) => {
  const { attachmentId } = req.validatedAttachmentId;
  const user = req.user;

  // check user role
  const isAdminOrSuperAdmin = checkUserRole(
    ['Admin', 'Super Admin'],
    user,
    res
  );

  if (!isAdminOrSuperAdmin) {
    return res
      .status(401)
      .json({ error: 'You are not authorized to update attachments' });
  }

  // check if attachment exists
  const attachment = await Attachment.findByPk(attachmentId);

  if (!attachment) {
    res.status(404).json({ error: 'Attachment not found' });
    return;
  }

  await attachment.destroy();

  res.status(204).send();
};

module.exports = {
  getAttachments,
  getAttachmentById,
  updateAttachment,
  deleteAttachment
};
