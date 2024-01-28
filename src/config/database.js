const { Sequelize } = require('sequelize');
const config = require('./config');
const { logger } = require('./logging');

// Sequelize configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  username: config.DB_USER,
  password: config.DB_PASSWORD
});

const checkConnection = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: false });

    logger.info(`${config.DB_NAME} DB Connected and synced `);
  } catch (error) {
    logger.error(`Unable to connect to the ${config.DB_NAME} database`, error);
  }
};

checkConnection();

module.exports = sequelize;
