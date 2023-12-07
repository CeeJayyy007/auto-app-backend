const { checkUserRole } = require('../middlewares/authMiddleware');
const Inventory = require('../models/inventory');

// Get all inventory
const getInventory = async (req, res) => {
  const inventory = await Inventory.findAll();
  res.status(200).json(inventory);
};

// Get a specific inventory by ID
const getInventoryById = async (req, res) => {
  const { inventoryId } = req.validatedInventoryId;

  // check user role
  checkUserRole(user);

  // check if inventory exists
  const inventory = await Inventory.findByPk(inventoryId);

  if (!inventory) {
    res.status(404).json({ error: 'Inventory not found' });
    return;
  }

  res.status(200).json(inventory);
};

// Get a inventory and the user associated with it
const getInventoryAndUser = async (req, res) => {
  const { inventoryId } = req.validatedInventoryId;

  // check user role
  checkUserRole(user, res);

  // check if inventory exists
  const inventory = await Inventory.findByPk(inventoryId);

  if (!inventory) {
    res.status(404).json({ error: 'Inventory not found' });
    return;
  }

  const user = await inventory.getUser();

  res.status(200).json({ inventory, user });
};

// Update a inventory by ID
const updateInventory = async (req, res) => {
  const { inventoryId } = req.validatedInventoryId;
  const user = req.user;

  // check user role
  checkUserRole(user, res);

  // check if inventory exists
  const inventory = await Inventory.findByPk(inventoryId);

  if (!inventory) {
    res.status(404).json({ error: 'Inventory not found' });
    return;
  }

  // Update the inventory
  const [updatedRows] = await Inventory.update(
    { ...req.validatedPartialInventory, updatedBy: user.id },
    {
      where: { id: inventoryId },
      individualHooks: true
    }
  );

  if (updatedRows === 0) {
    res.status(404).json({ error: 'Inventory not found' });
    return;
  }

  // Get the updated inventory record
  const updatedInventory = await Inventory.findByPk(inventoryId);

  res.status(200).json({
    inventory: updatedInventory,
    message: 'Inventory updated successfully'
  });
};

// Delete a inventory by ID
const deleteInventory = async (req, res) => {
  const { inventoryId } = req.validatedInventoryId;

  // check user role
  checkUserRole(user, res);

  // check if inventory exists
  const inventory = await Inventory.findByPk(inventoryId);

  if (!inventory) {
    res.status(404).json({ error: 'Inventory not found' });
    return;
  }

  // Delete the inventory
  await Inventory.destroy({ where: { id: inventoryId } });

  res.status(200).json({ message: 'Inventory deleted successfully' });
};

module.exports = {
  getInventory,
  getInventoryById,
  getInventoryAndUser,
  updateInventory,
  deleteInventory
};
