const bodyParser = require('body-parser');
const healthCheckRouter = require('express').Router();
const getHealthCheck = require('../controller/healthCheck');
healthCheckRouter.use(bodyParser.json());

/**
 * @openapi
 * '/api/health-check':
 *  get:
 *     tags:
 *     - HealthCheck Controller
 *     summary: Gets API health status
 *     responses:
 *      200:
 *        description: Health OK!
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
healthCheckRouter.get('/', getHealthCheck);

module.exports = healthCheckRouter;
