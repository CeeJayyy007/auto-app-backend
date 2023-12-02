const sequelize = require('../config/database');

module.exports = async () => {
  try {
    console.log('Running global teardown...');

    await sequelize.close();

    console.log('Global teardown completed.');
  } catch (error) {
    console.error('Error during global teardown:', error);
    throw error;
  }
};
