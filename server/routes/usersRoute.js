import express from 'express';

import UsersController from '../controllers/UsersController';
import adminsOnly from '../middleware/adminsOnly';
import validateToken from '../middleware/validateToken';

const usersRouter = express.Router();

usersRouter.route('/')
  .get(validateToken, adminsOnly, UsersController.getAllUsers)
  .post(UsersController.signUp);

usersRouter.route('/:id')
  .get(validateToken, adminsOnly, UsersController.getUser)
  .put(validateToken, UsersController.updateUserProfile)
  .delete(validateToken, UsersController.deleteUser);

usersRouter.route('/:id/documents')
  .get(validateToken, adminsOnly, UsersController.getUserDocuments);

usersRouter.route('/login')
  .post(UsersController.login);

usersRouter.route('/logout')
  .post(validateToken, UsersController.logout);

export default usersRouter;
