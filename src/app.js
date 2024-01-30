const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const app = express();
const authRouter = require('./routes/authRoutes');
const usersRouter = require('./routes/userRoutes');
const healthCheckRouter = require('./routes/healthCheckRoutes');
const vehiclesRouter = require('./routes/vehicleRoutes');
const appointmentsRouter = require('./routes/appointmentRoutes');
const inventoryRouter = require('./routes/inventoryRoutes');
const servicesRouter = require('./routes/serviceRoutes');
const attachmentsRouter = require('./routes/attachmentRoutes');
const maintenanceRecordsRouter = require('./routes/maintenanceRecordRoutes');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { tokenExtractor } = require('./middlewares/authMiddleware');
const { morganMiddleware } = require('./config/logging');
const unknownEndpoint = require('./middlewares/unknownEndpoint');
const morgan = require('morgan');
const swaggerDocs = require('./swagger-ui/swagger');

// middlewares
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('combine', { stream: morganMiddleware.stream }));
app.disable('x-powered-by');
app.use(tokenExtractor);

// routes
app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/health-check', healthCheckRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/services', servicesRouter);
app.use('/api/maintenance-records', maintenanceRecordsRouter);
app.use('/api/attachments', attachmentsRouter);

// middleware for testing purposes
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controller/testing');
  app.use('/api/testing', testingRouter);
}

// sawgger ui docs
swaggerDocs(app);

// use unknown endpoint middleware
app.use(unknownEndpoint);

// use error handler middleware
app.use(errorHandler);

module.exports = app;
