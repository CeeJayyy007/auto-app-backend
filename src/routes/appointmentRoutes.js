const appointmentController = require('../controller/appointment');
const bodyParser = require('body-parser');
const appointmentsRouter = require('express').Router();
appointmentsRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');

// appointment routes
/** GET Methods */
/**
 * @openapi
 * '/api/appointments':
 * get:
 *     tags:
 *     - Appointment Controller
 *     summary: Get all appointments
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
appointmentsRouter.get('/', appointmentController.getAppointments);

/**
 * @openapi
 * '/api/appointments/{appointmentId}':
 * get:
 *     tags:
 *     - Appointment Controller
 *     summary: Get a appointment by id
 *     parameters:
 *      - id: appointmentId
 *        in: path
 *        description: The unique Id of the appointment
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
appointmentsRouter.get(
  '/:appointmentId',
  authMiddleware.userExtractor,
  appointmentController.getAppointmentById
);

/**
 * @openapi
 * '/api/appointment/{appointmentId}/user':
 *  get:
 *     tags:
 *     - Appointment Controller
 *     summary: Get an appointment and the user associated with it
 *     parameters:
 *      - id: appointmentId
 *        in: path
 *        description: The unique Id of the appointment
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
appointmentsRouter.get(
  '/:appointmentId/user',
  appointmentController.getAppointmentAndUser
);

/** PUT Methods */
/**
 * @openapi
 * '/api/appointments/{appointmentId}':
 * put:
 *     tags:
 *     - Appointment Controller
 *     summary: Modify a appointment
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - appointmentId
 *            properties:
 *              date:
 *                type: string
 *                default: ''
 *              time:
 *                type: string
 *                default: ''
 *              note:
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
appointmentsRouter.put(
  '/:appointmentId',
  authMiddleware.userExtractor,
  appointmentController.updateAppointment
);

/** DELETE Methods */
/**
 * @openapi
 * '/api/appointments/{appointmentId}':
 *  delete:
 *     tags:
 *     - Appointment Controller
 *     summary: Delete appointment by Id
 *     parameters:
 *      - name: appointmentId
 *        in: path
 *        description: The unique Id of the appointment
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
appointmentsRouter.delete(
  '/:appointmentId',
  authMiddleware.userExtractor,
  appointmentController.deleteAppointment
);

module.exports = appointmentsRouter;
