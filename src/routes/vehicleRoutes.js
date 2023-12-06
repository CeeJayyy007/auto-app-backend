const vehicleController = require('../controller/vehicle');
const bodyParser = require('body-parser');
const vehiclesRouter = require('express').Router();
vehiclesRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateVehicleId,
  validateVehicle
} = require('../middlewares/validations/validateVehicle');

// vehicle routes
/** GET Methods */
/**
 * @openapi
 * '/api/vehicles':
 * get:
 *     tags:
 *     - Vehicle Controller
 *     summary: Get all vehicles
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
vehiclesRouter.get(
  '/',
  authMiddleware.userExtractor,
  vehicleController.getVehicles
);

/**
 * @openapi
 * '/api/vehicles/{vehicleId}':
 *  get:
 *     tags:
 *     - Vehicle Controller
 *     summary: Get a vehicle by id
 *     parameters:
 *      - id: vehicleId
 *        description: The unique Id of the vehicle
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
vehiclesRouter.get(
  '/:vehicleId',
  validateVehicleId,
  vehicleController.getVehicleById
);

/**
 * @openapi
 * '/api/vehicles/{vehicleId}/user':
 *  get:
 *     tags:
 *     - Vehicle Controller
 *     summary: Get a vehicle and the user associated with it
 *     parameters:
 *      - id: vehicleId
 *        in: path
 *        description: The unique Id of the vehicle
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
vehiclesRouter.get(
  '/:vehicleId/user',
  validateVehicleId,
  vehicleController.getVehicleAndUser
);

/** PUT Methods */
/**
 * @openapi
 * '/api/vehicles/{vehicleId}':
 *  put:
 *     tags:
 *     - Vehicle Controller
 *     summary: Modify a vehicle
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - vehicleId
 *            properties:
 *              make:
 *                type: string
 *                default: ''
 *              model:
 *                type: string
 *                default: ''
 *              year:
 *                type: string
 *                default: ''
 *             registration_number:
 *               type: string
 *              default: ''
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
vehiclesRouter.put(
  '/:vehicleId',
  authMiddleware.userExtractor,
  validateVehicleId,
  validateVehicle,
  vehicleController.updateVehicle
);

/** DELETE Methods */
/**
 * @openapi
 * '/api/vehicles/{vehicleId}':
 *  delete:
 *     tags:
 *     - Vehicle Controller
 *     summary: Delete vehicle by Id
 *     parameters:
 *      - name: vehicleId
 *        in: path
 *        description: The unique Id of the vehicle
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
vehiclesRouter.delete(
  '/:vehicleId',
  authMiddleware.userExtractor,
  validateVehicleId,
  vehicleController.deleteVehicle
);

module.exports = vehiclesRouter;
