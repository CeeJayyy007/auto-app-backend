const Inventory = require('../../models/inventory');

const attachInventory = async (hostModel, inventoryId) => {
  // check if services in serviceId array exist
  const inventories = await Inventory.findAll({
    where: { id: inventoryId }
  });

  // check that the services returned are the same as the ones in the serviceId array
  if (inventories.length !== inventoryId.length) {
    return res.status(404).json({ error: 'Inventory not found' });
  }

  // add selected services in serviceId array to the hostModel
  await hostModel.addInventories(inventories);
};

module.exports = attachInventory;
