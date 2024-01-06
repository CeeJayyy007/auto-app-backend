const serviceController = require('../controller/service');
const bodyParser = require('body-parser');
const servicesRouter = require('express').Router();
servicesRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateServiceId,
  validatePartialService
} = require('../middlewares/validations/validateService');

// service routes
/** GET Methods */
/**
 * @openapi
 * '/api/services':
 *  get:
 *     security:
 *     - Bearer:
 *     tags:
 *     - Service Controller
 *     summary: Get all services
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
servicesRouter.get('/', serviceController.getServices);

/**
 * @openapi
 * '/api/services/{serviceId}':
 *  get:
 *     tags:
 *     - Service Controller
 *     summary: Get a service by id
 *     parameters:
 *      - id: serviceId
 *        description: The unique Id of the service
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
servicesRouter.get(
  '/:serviceId',
  validateServiceId,
  serviceController.getServiceById
);

/**
 * @openapi
 * '/api/services/{serviceId}/user':
 *  get:
 *     tags:
 *     - Service Controller
 *     summary: Get a service and the user associated with it
 *     parameters:
 *      - id: serviceId
 *        in: path
 *        description: The unique Id of the service
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
servicesRouter.get(
  '/:serviceId/user',
  validateServiceId,
  serviceController.getServiceAndUser
);

/** PUT Methods */
/**
 * @openapi
 * '/api/services/{serviceId}':
 *  put:
 *     tags:
 *     - Service Controller
 *     summary: Modify a service
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - serviceId
 *            properties:
 *              name:
 *                type: string
 *                default: oil change
 *              price:
 *                type: integer
 *                default: 1000
 *              description:
 *                type: string
 *                default: This is a description
 *     responses:
 *       200:
 *          description: Modified
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
servicesRouter.put(
  '/:serviceId',
  authMiddleware.userExtractor,
  validateServiceId,
  validatePartialService,
  serviceController.updateService
);

/** DELETE Methods */
/**
 * @openapi
 * '/api/services/{serviceId}':
 *  delete:
 *     tags:
 *     - Service Controller
 *     summary: Delete service by Id
 *     parameters:
 *      - name: serviceId
 *        in: path
 *        description: The unique Id of the service
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
servicesRouter.delete(
  '/:serviceId',
  authMiddleware.userExtractor,
  validateServiceId,
  serviceController.deleteService
);

module.exports = servicesRouter;
