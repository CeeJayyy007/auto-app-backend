const userController = require('./controller/user');
const authController = require('./controller/auth');
const bodyParser = require('body-parser');
const usersRouter = require('express').Router();
usersRouter.use(bodyParser.json());
const authRouter = require('express').Router();
authRouter.use(bodyParser.json());
const authMiddleware = require('./middlewares/authMiddleware');

// user routes
usersRouter.get('/', authMiddleware.userExtractor, userController.getUsers);
usersRouter.get(
  '/:userId',
  authMiddleware.userExtractor,
  userController.getUserById
);
usersRouter.post('/', userController.createUser);
usersRouter.put(
  '/:userId',
  authMiddleware.userExtractor,
  userController.updateUser
);
usersRouter.delete(
  '/:userId',
  authMiddleware.userExtractor,
  userController.deleteUser
);

// auth routes
authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);

module.exports = { usersRouter, authRouter };
