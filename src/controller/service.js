const { checkUserRole } = require('../middlewares/authMiddleware');
const Service = require('../models/service');

// Get all services
const getServices = async (req, res) => {
  const services = await Service.findAll();
  res.status(200).json(services);
};

// Get a specific service by ID
const getServiceById = async (req, res) => {
  const { serviceId } = req.validatedServiceId;

  // check if service exists
  const service = await Service.findByPk(serviceId);

  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  res.status(200).json(service);
};

// Get a service and the user associated with it
const getServiceAndUser = async (req, res) => {
  const { serviceId } = req.validatedServiceId;

  // check if service exists
  const service = await Service.findByPk(serviceId);

  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  const user = await service.getUser();

  res.status(200).json({ service, user });
};

// Update a service by ID
const updateService = async (req, res) => {
  const { serviceId } = req.validatedServiceId;
  const user = req.user;

  console.log('user', user, 'serviceId', serviceId);

  // check user role
  checkUserRole(user, res);

  // check if service exists
  const service = await Service.findByPk(serviceId);

  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  // Update the service
  const [updatedRows] = await Service.update(
    {
      ...req.validatedPartialService,
      updatedBy: user.id
    },
    {
      where: { id: serviceId }
    }
  );

  if (updatedRows === 0) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  // Get the updated service record
  const updatedService = await Service.findByPk(serviceId);

  res
    .status(200)
    .json({ service: updatedService, message: 'Service updated successfully' });
};

// Delete a service by ID
const deleteService = async (req, res) => {
  const { serviceId } = req.validatedServiceId;
  const user = req.user;

  // check user role
  checkUserRole(user, res);

  // check if service exists
  const service = await Service.findByPk(serviceId);

  if (!service) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  // Delete the service
  await service.destroy();

  res.status(204).end({ message: 'Service deleted successfully' });
};

module.exports = {
  getServices,
  getServiceById,
  getServiceAndUser,
  updateService,
  deleteService
};
