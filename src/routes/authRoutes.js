const authController = require('../controller/auth');
const bodyParser = require('body-parser');
const authRouter = require('express').Router();
authRouter.use(bodyParser.json());
const {
  validateRegistration,
  validateLogin
} = require('../middlewares/validations/validateAuth');

// auth routes
/**
 * @openapi
 * '/api/login':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Login as a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                default: john@doe.com
 *              password:
 *                type: password
 *                default: johnDoe20!@
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
authRouter.post('/login', validateLogin, authController.login);

/** POST Methods */
/**
 * @openapi
 * '/api/register':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstName
 *              - lastName
 *              - username
 *              - email
 *              - password
 *              - phone
 *            properties:
 *              firstName:
 *                type: string
 *                default: john
 *              lastName:
 *                type: string
 *                default: doe
 *              username:
 *                type: string
 *                default: johndoe
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *              phone:
 *                type: number
 *                default: +1234567890
 *
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

authRouter.post('/register', validateRegistration, authController.register);

module.exports = authRouter;
