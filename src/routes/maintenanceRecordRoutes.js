const maintenanceRecordController = require('../controller/maintenanceRecord');
const bodyParser = require('body-parser');
const maintenanceRecordsRouter = require('express').Router();
maintenanceRecordsRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateMaintenanceRecordsId,
  validatePartialMaintenanceRecord
} = require('../middlewares/validations/validateMaintenanceRecord');

// maintenanceRecord routes
/** GET Methods */
/**
 * @openapi
 * '/api/maintenanceRecords':
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
 * '/api/maintenanceRecords/{maintenanceRecordId}':
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
 * '/api/maintenanceRecord/{maintenanceRecordId}/user':
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
 * '/api/maintenanceRecords/{maintenanceRecordId}':
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

/** DELETE Methods */
/**
 * @openapi
 * '/api/maintenanceRecords/{maintenanceRecordId}':
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
