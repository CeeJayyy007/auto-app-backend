const Service = require('../../models/service');

const attachServices = async (hostModel, serviceId, res) => {
  // check if services in serviceId array exist
  const services = await Service.findAll({
    where: { id: serviceId }
  });

  // check that the services returned are the same as the ones in the serviceId array
  if (services.length !== serviceId.length) {
    return res.status(404).json({ error: 'Service not found' });
  }

  // add selected services in serviceId array to the hostModel
  await hostModel.addServices(services);
};

module.exports = attachServices;
