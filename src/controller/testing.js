const testingRouter = require('express').Router();
const User = require('../models/user');

testingRouter.post('/reset', async (request, response) => {
  await User.destroy({
    where: {}
  })
    .then((deletedRows) => {
      console.log(`Deleted ${deletedRows} rows from the User table.`);
    })
    .catch((error) => {
      console.error('Error deleting records:', error);
    });

  response.status(204).end();
});

module.exports = testingRouter;
