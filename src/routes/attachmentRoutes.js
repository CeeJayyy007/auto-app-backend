const attachmentController = require('../controller/attachment');
const bodyParser = require('body-parser');
const attachmentsRouter = require('express').Router();
attachmentsRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateAttachmentId,
  validatePartialAttachment
} = require('../middlewares/validations/validateAttachment');

// attachment routes
/** GET Methods */
/**
 * @openapi
 * '/api/attachments':
 *  get:
 *    tags:
 *    - Attachment Controller
 *    summary: Get all attachments
 *    responses:
 *     200:
 *       description: Fetched Successfully
 *     400:
 *       description: Bad Request
 *     404:
 *       description: Not Found
 *     500:
 *       description: Server Error
 */
attachmentsRouter.get('/', attachmentController.getAttachments);

/**
 * @openapi
 * '/api/attachments/{attachmentId}':
 *  get:
 *    tags:
 *    - Attachment Controller
 *    summary: Get a attachment by id
 *    parameters:
 *     - id: attachmentId
 *       in: path
 *       description: The unique Id of the attachment
 *       required: true
 *    responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
attachmentsRouter.get(
  '/:attachmentId',
  authMiddleware.userExtractor,
  validateAttachmentId,
  attachmentController.getAttachmentById
);

/** PUT Methods */
/**
 * @openapi
 * '/api/attachments/{attachmentId}':
 *  put:
 *     tags:
 *     - Attachment Controller
 *     summary: Modify a attachment
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - attachmentId
 *            properties:
 *              name:
 *                type: string
 *                default: receipt 1
 *              filePath:
 *                type: string
 *                default: /receipts/receipt1.pdf
 *              description:
 *                type: string
 *                default: This is a description
 *     responses:
 *      200:
 *        description: Modified
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
attachmentsRouter.put(
  '/:attachmentId',
  authMiddleware.userExtractor,
  validateAttachmentId,
  validatePartialAttachment,
  attachmentController.updateAttachment
);

/** DELETE Methods */
/**
 * @openapi
 * '/api/attachments/{attachmentId}':
 *  delete:
 *     tags:
 *     - Attachment Controller
 *     summary: Delete attachment by Id
 *     parameters:
 *      - name: attachmentId
 *        in: path
 *        description: The unique Id of the attachment
 *        required: true
 *     responses:
 *      200:
 *        description: Removed
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
attachmentsRouter.delete(
  '/:attachmentId',
  authMiddleware.userExtractor,
  validateAttachmentId,
  attachmentController.deleteAttachment
);

module.exports = attachmentsRouter;
