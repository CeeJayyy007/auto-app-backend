const appointmentController = require('../controller/appointment');
const bodyParser = require('body-parser');
const appointmentsRouter = require('express').Router();
appointmentsRouter.use(bodyParser.json());
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateAppointmentsId,
  validatePartialAppointment
} = require('../middlewares/validations/validateAppointments');

// appointment routes
/** GET Methods */
/**
 * @openapi
 * '/api/appointments':
 *  get:
 *    tags:
 *    - Appointment Controller
 *    summary: Get all appointments
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
appointmentsRouter.get('/', appointmentController.getAppointments);

/**
 * @openapi
 * '/api/appointments/{appointmentId}':
 *  get:
 *    tags:
 *    - Appointment Controller
 *    summary: Get a appointment by id
 *    parameters:
 *     - id: appointmentId
 *       in: path
 *       description: The unique Id of the appointment
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
appointmentsRouter.get(
  '/:appointmentId',
  validateAppointmentsId,
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
  validateAppointmentsId,
  appointmentController.getAppointmentAndUser
);

/** PUT Methods */
/**
 * @openapi
 * '/api/appointments/{appointmentId}':
 *  put:
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
 *              status:
 *                type: string
 *                default: approved
 *              note:
 *                type: string
 *                default: This is a note
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
  validateAppointmentsId,
  validatePartialAppointment,
  appointmentController.updateAppointment
);

/** POST Methods */
/**
 * @openapi
 * '/api/appointments/{appointmentId}':
 *  post:
 *     tags:
 *     - Appointment Controller
 *     summary: Create a Service Request
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - appointmentId
 *            properties:
 *              note:
 *                type: string
 *                default: This is a note
 *              serviceId:
 *                type: [integer]
 *                default: [1,2]
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
appointmentsRouter.post(
  '/create-service-request',
  authMiddleware.userExtractor,
  validatePartialAppointment,
  appointmentController.createServiceRequest
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
  validateAppointmentsId,
  appointmentController.deleteAppointment
);

module.exports = appointmentsRouter;
