const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  isValidPassword,
  sanitizeUserData,
  generateToken
} = require('../middlewares/authMiddleware');

const register = async (req, res) => {
  const { email, password, firstName, lastName, username, phone } =
    req.validatedData;

  // Check if the password meets the minimum requirements
  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Invalid password format' });
  }

  // Check if the email is already registered
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Email is already registered' });
  }

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with the hashed password
  const newUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: hashedPassword,
    phone: phone,
    avatar: null // Set the avatar to null for now (add default avatar later),
  });

  // Exclude the password field from the response
  const sanitizedUser = sanitizeUserData(newUser);

  // Generate and send an authentication token
  const token = generateToken(sanitizedUser);
  res.status(201).send({ token, user: sanitizedUser });
};

const login = async (req, res) => {
  const { email, password } = req.validatedData;

  // Find the user with the given email
  const user = await User.findOne({
    where: { email },
    attributes: { include: ['password'] }
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!(user && passwordMatch)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Exclude the password field from the response
  const sanitizedUser = sanitizeUserData(user);

  // Generate and send an authentication token
  const token = generateToken(user);
  res.status(200).json({ token, ...sanitizedUser });
};

module.exports = { register, login };
