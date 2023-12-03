const getHealthCheck = async (req, res) => {
  await res
    .status(200)
    .json({ message: 'Server is up and running', date: new Date().toJSON() });
};

module.exports = getHealthCheck;
