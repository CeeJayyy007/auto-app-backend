const User = require('../models/user');
const jwt = require('jsonwebtoken');

// add token extractor middleware
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }

  next();
};

// add user extractor middleware
const userExtractor = async (req, res, next) => {
  // decode token
  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.userId) {
    return res.status(401).json({ error: 'invalid token' });
  }

  // get user from token
  const user = await User.findByPk(decodedToken.userId);

  req.user = user;

  next();
};

module.exports = {
  tokenExtractor,
  userExtractor
};
