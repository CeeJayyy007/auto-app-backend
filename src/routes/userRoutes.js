const userController = require('../controller/user');
const bodyParser = require('body-parser');
const usersRouter = require('express').Router();
usersRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateRegistration
} = require('../middlewares/validations/validateAuth');
const {
  validateVehicle
} = require('../middlewares/validations/validateVehicle');
const {
  validateAppointments
} = require('../middlewares/validations/validateAppointments');
const {
  validateInventory
} = require('../middlewares/validations/validateInventory');
const {
  validateService
} = require('../middlewares/validations/validateService');
const {
  validatePartialUser,
  validateUserId
} = require('../middlewares/validations/validateUser');

// user routes
/** GET Methods */
/**
 * @openapi
 * '/api/users':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get all users
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
usersRouter.get('/', userController.getUsers);

/**
 * @openapi
 * '/api/users/{userId}':
 *  get:
 *     tags:
 *     - User Controller
 *     summary: Get a user by id
 *     parameters:
 *      - id: userId
 *        in: path
 *        description: The unique Id of the user
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
usersRouter.get(
  '/:userId',
  authMiddleware.userExtractor,
  userController.getUserById
);

usersRouter.post('/', validateRegistration, userController.createUser);

/** PUT Methods */
/**
 * @openapi
 * '/api/users/{userId}':
 *  put:
 *     tags:
 *     - User Controller
 *     summary: Modify a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userId
 *            properties:
 *              userId:
 *                type: string
 *                default: ''
 *              firstName:
 *                type: string
 *                default: ''
 *              lastName:
 *                type: string
 *                default: ''
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
usersRouter.put(
  '/:userId',
  authMiddleware.userExtractor,
  validatePartialUser,
  userController.updateUser
);

/** POST Methods */
/**
 * @openapi
 * '/api/users/{userId}/add-vehicle':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Add a vehicle
 *     parameters:
 *      - id: userId
 *        in: path
 *        description: The unique Id of the user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - make
 *              - model
 *              - year
 *              - registration_number
 *            properties:
 *              make:
 *                type: string
 *                default: toyota
 *              model:
 *                type: string
 *                default: corolla
 *              year:
 *                type: number
 *                default: 2014
 *              registration_number:
 *                type: string
 *                default: XA123FG
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
usersRouter.post(
  '/:userId/add-vehicle',
  validateVehicle,
  validateUserId,
  userController.addUserVehicle
);

/**
 * @openapi
 * '/api/users/{userId}/create-appointment':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create an appointment
 *     parameters:
 *      - id: userId
 *        in: path
 *        description: The unique Id of the user
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - date
 *              - time
 *              - note
 *            properties:
 *              date:
 *                type: string
 *                default: 2021-01-01
 *              time:
 *                type: string
 *                default: 2:00 PM
 *              request:
 *                type: string
 *                default: oil change, tire rotation
 *              note:
 *                type: string
 *                default: This is a note
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
usersRouter.post(
  '/:userId/create-appointment',
  authMiddleware.userExtractor,
  validateAppointments,
  userController.createAppointment
);

/**
 * @openapi
 * '/api/users/{userId}/create-inventory':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create an inventory item
 *     parameters:
 *      - id: userId
 *        in: path
 *        description: The unique Id of the user
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - quantity
 *              - lowLevel
 *              - initialPrice
 *              - markUp
 *              - finalPrice
 *            properties:
 *              name:
 *                type: string
 *                default: tyre
 *              quantity:
 *                type: number
 *                default: 2
 *              lowLevel:
 *                type: number
 *                default: 1
 *              initialPrice:
 *                type: integer
 *                default: 2000
 *              markUp:
 *                type: integer
 *                default: 2
 *              finalPrice:
 *                type: integer
 *                default: 4000
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
usersRouter.post(
  '/:userId/create-inventory',
  authMiddleware.userExtractor,
  validateInventory,
  userController.createInventory
);

/**
 * @openapi
 * '/api/users/{userId}/create-service':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a service
 *     parameters:
 *      - id: userId
 *        in: path
 *        description: The unique Id of the user
 *        required: true
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - price
 *              - description
 *            properties:
 *              name:
 *                type: string
 *                default: oil change
 *              description:
 *                type: string
 *                default: This is a description
 *              price:
 *                type: integer
 *                default: 1000
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
usersRouter.post(
  '/:userId/create-service',
  authMiddleware.userExtractor,
  validateService,
  userController.createService
);

/** DELETE Methods */
/**
 * @openapi
 * '/api/users/{userId}':
 *  delete:
 *     tags:
 *     - User Controller
 *     summary: Delete user by Id
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The unique Id of the user
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
usersRouter.delete(
  '/:userId',
  authMiddleware.userExtractor,
  userController.deleteUser
);

module.exports = usersRouter;
