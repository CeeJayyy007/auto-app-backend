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

  // check if user exists
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  req.user = user;

  next();
};

// add token generator
const generateToken = (user) => {
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  );
  return token;
};

// add password validator
const isValidPassword = (password) => {
  // pasword rule: 1 uppercase, 1 lowercase, 1 number, 1 special character, min 8 characters
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return passwordRegex.test(password);
};

// check if user has admin or superAdmin role
const checkUserRole = (existingUser, res) => {
  if (existingUser.roles === 'user') {
    return res
      .status(401)
      .json({ error: 'You are not authorized to create an inventory' });
  }

  return true;
};

// add user data sanitizer
const sanitizeUserData = (user) => {
  const sanitizedUserData = user.toJSON();
  delete sanitizedUserData.password;
  delete sanitizedUserData.deletedAt;
  return sanitizedUserData;
};

module.exports = {
  tokenExtractor,
  userExtractor,
  generateToken,
  isValidPassword,
  sanitizeUserData,
  checkUserRole
};
