const userController = require('../controller/user');
const bodyParser = require('body-parser');
const usersRouter = require('express').Router();
usersRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');

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
usersRouter.get('/', authMiddleware.userExtractor, userController.getUsers);

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

usersRouter.post('/', userController.createUser);

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
  userController.updateUser
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
