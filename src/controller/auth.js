const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authRouter = require('express').Router();
authRouter.use(bodyParser.json());

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

const isValidPassword = (password) => {
  // Add your password rules here (e.g., minimum length, special characters, etc.)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return passwordRegex.test(password);
};

authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;

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
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    phone: req.body.phone,
    avatar: null // Set the avatar to null for now (add default avatar later),
  });

  // Exclude the password field from the response
  const userWithoutPassword = newUser.toJSON();
  delete userWithoutPassword.password;

  // Generate and send an authentication token
  const token = generateToken(userWithoutPassword);
  res.status(201).send({ token, user: userWithoutPassword });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user with the given email
  const user = await User.findOne({ where: { email } });

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!(user && passwordMatch)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Exclude the password field from the response
  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  // Generate and send an authentication token
  const token = generateToken(userWithoutPassword);
  res.status(200).json({ token, user: userWithoutPassword });
});

module.exports = authRouter;
