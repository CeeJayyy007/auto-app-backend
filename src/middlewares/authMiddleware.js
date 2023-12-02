const { log } = require('console');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// add token extractor middleware
const tokenExtractor = (req, res) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    console.log('authorization', authorization.substring(7));

    return (req.token = authorization.substring(7));
  }

  return null;
};

// add user extractor middleware
const userExtractor = async (req, res, next) => {
  // decode token
  const decodedToken = jwt.verify(tokenExtractor(req), process.env.SECRET);

  console.log('hereeeee', decodedToken, process.env.SECRET);

  if (!decodedToken.userId) {
    return res.status(401).json({ error: 'invalid token' });
  }

  // get user from token
  const user = await User.findByPk(decodedToken.userId);

  req.user = user;

  console.log('user', user);
  next();
};

module.exports = {
  tokenExtractor,
  userExtractor
};
