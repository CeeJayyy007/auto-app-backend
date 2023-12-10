const maintenanceRecordController = require('../controller/maintenanceRecord');
const bodyParser = require('body-parser');
const maintenanceRecordsRouter = require('express').Router();
maintenanceRecordsRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateMaintenanceRecordsId,
  validatePartialMaintenanceRecord
} = require('../middlewares/validations/validateMaintenanceRecord');
const {
  validateAttachment,
  validateAttachmentId
} = require('../middlewares/validations/validateAttachment');

// maintenanceRecord routes
/** GET Methods */
/**
 * @openapi
 * '/api/maintenance-records':
 *  get:
 *    tags:
 *    - MaintenanceRecord Controller
 *    summary: Get all maintenanceRecords
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
maintenanceRecordsRouter.get(
  '/',
  maintenanceRecordController.getMaintenanceRecords
);

/**
 * @openapi
 * '/api/maintenance-records/{maintenanceRecordId}':
 *  get:
 *    tags:
 *    - MaintenanceRecord Controller
 *    summary: Get a maintenanceRecord by id
 *    parameters:
 *     - id: maintenanceRecordId
 *       in: path
 *       description: The unique Id of the maintenanceRecord
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
maintenanceRecordsRouter.get(
  '/:maintenanceRecordId',
  authMiddleware.userExtractor,
  validateMaintenanceRecordsId,
  maintenanceRecordController.getMaintenanceRecordById
);

/**
 * @openapi
 * '/api/maintenance-records/{maintenanceRecordId}/user':
 *  get:
 *     tags:
 *     - MaintenanceRecord Controller
 *     summary: Get an maintenanceRecord and the user associated with it
 *     parameters:
 *      - id: maintenanceRecordId
 *        in: path
 *        description: The unique Id of the maintenanceRecord
 *        required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
maintenanceRecordsRouter.get(
  '/:maintenanceRecordId/user',
  validateMaintenanceRecordsId,
  maintenanceRecordController.getMaintenanceRecordAndUser
);

/** PUT Methods */
/**
 * @openapi
 * '/api/maintenance-records/{maintenanceRecordId}':
 *  put:
 *     tags:
 *     - MaintenanceRecord Controller
 *     summary: Modify a maintenanceRecord
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - maintenanceRecordId
 *            properties:
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
maintenanceRecordsRouter.put(
  '/:maintenanceRecordId',
  authMiddleware.userExtractor,
  validateMaintenanceRecordsId,
  validatePartialMaintenanceRecord,
  maintenanceRecordController.updateMaintenanceRecord
);

/**
 * @openapi
 * '/api/maintenance-records/{maintenanceRecordId}/add-attachment':
 *  post:
 *     tags:
 *     - MaintenanceRecord Controller
 *     summary: Create and add an attachment to a maintenanceRecord
 *     parameters:
 *      - id: maintenanceRecordId
 *        in: path
 *        description: The unique maintenanceRecordId
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - filePath
 *            properties:
 *              name:
 *                type: string
 *                default: scan of receipt
 *              filePath:
 *                type: string
 *                default: https://www.google.com
 *              description:
 *                type: string
 *                default: This is a description
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
maintenanceRecordsRouter.post(
  '/:maintenanceRecordId/add-attachment',
  authMiddleware.userExtractor,
  validateAttachment,
  validateMaintenanceRecordsId,
  maintenanceRecordController.createAttachment
);

/** DELETE Methods */
/**
 * @openapi
 * '/api/maintenance-records/{maintenanceRecordId}':
 *  delete:
 *     tags:
 *     - MaintenanceRecord Controller
 *     summary: Delete maintenanceRecord by Id
 *     parameters:
 *      - name: maintenanceRecordId
 *        in: path
 *        description: The unique Id of the maintenanceRecord
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
maintenanceRecordsRouter.delete(
  '/:maintenanceRecordId',
  authMiddleware.userExtractor,
  validateMaintenanceRecordsId,
  maintenanceRecordController.deleteMaintenanceRecord
);

module.exports = maintenanceRecordsRouter;
