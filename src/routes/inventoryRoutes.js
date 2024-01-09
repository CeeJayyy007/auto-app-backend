const inventoryController = require('../controller/inventory');
const bodyParser = require('body-parser');
const inventoryRouter = require('express').Router();
inventoryRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateInventoryId,
  validateInventory,
  validatePartialInventory
} = require('../middlewares/validations/validateInventory');

// inventory routes
/** GET Methods */
/**
 * @openapi
 * '/api/inventory':
 *  get:
 *     tags:
 *     - Inventory Controller
 *     summary: Get all inventory
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
inventoryRouter.get('/', inventoryController.getInventory);

/**
 * @openapi
 * '/api/inventory/{inventoryId}':
 *  get:
 *     tags:
 *     - Inventory Controller
 *     summary: Get a inventory by id
 *     parameters:
 *      - id: inventoryId
 *        description: The unique Id of the inventory
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
inventoryRouter.get(
  '/:inventoryId',
  validateInventoryId,
  inventoryController.getInventoryById
);

/**
 * @openapi
 * '/api/inventory/{inventoryId}/user':
 *   get:
 *     tags:
 *     - Inventory Controller
 *     summary: Get a inventory and the user associated with it
 *     parameters:
 *      - id: inventoryId
 *        in: path
 *        description: The unique Id of the inventory
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
inventoryRouter.get(
  '/:inventoryId/user',
  validateInventoryId,
  inventoryController.getInventoryAndUser
);

/** PUT Methods */
/**
 * @openapi
 * '/api/inventory/{inventoryId}':
 *  put:
 *     tags:
 *     - Inventory Controller
 *     summary: Modify a inventory
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - inventoryId
 *            properties:
 *              name:
 *                type: string
 *                default: test tool
 *              quantity:
 *                type: string
 *                default: 10
 *              lowLevel:
 *                type: string
 *                default: 2
 *              initialPrice:
 *                type: string
 *                default: 200
 *              markUp:
 *                type: string
 *                default: 1.5
 *              finalPrice:
 *                type: string
 *                default: 300
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
inventoryRouter.put(
  '/:inventoryId',
  authMiddleware.userExtractor,
  validateInventoryId,
  validatePartialInventory,
  inventoryController.updateInventory
);

/** DELETE Methods */
/**
 * @openapi
 * '/api/inventory/{inventoryId}':
 *  delete:
 *     tags:
 *     - Inventory Controller
 *     summary: Delete inventory by Id
 *     parameters:
 *      - name: inventoryId
 *        in: path
 *        description: The unique Id of the inventory
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
inventoryRouter.delete(
  '/:inventoryId',
  authMiddleware.userExtractor,
  validateInventoryId,
  inventoryController.deleteInventory
);

module.exports = inventoryRouter;
