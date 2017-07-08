import express from 'express';

import UsersController from '../controllers/UsersController';
import adminsOnly from '../middleware/adminsOnly';
import ownerOrAdminsOnly from '../middleware/ownerOrAdminsOnly';
import validateToken from '../middleware/validateToken';

const usersRouter = express.Router();

/**
 * @swagger
 * definitions:
 *   NewDocument:
 *     type: object
 *     required:
 *        - title
 *        - content
 *        - access
 *        - categories
 *        - tags
 *        - authorId
 *     properties:
 *       title:
 *         type: string
 *       content:
 *         type: string
 *       access:
 *         type: string
 *       categories:
 *         type: string
 *       tags:
 *         type: string
 *       authorId:
 *         type: string
 *   Document:
 *     allOf:
 *       - $ref: '#definitions/NewDocument'
 *       - required:
 *       - id:
 *           type: integer
 *           format: int64
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *       - firstName
 *       - lastName
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *   User:
 *      allOf:
 *       - $ref: '#definitions/NewUser'
 *       - required:
 *       - id:
 *           type: integer
 *           format: int64
 *   LoginUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 */
usersRouter.route('/')
  /**
   * @swagger
   * /api/users:
   *   get:
   *     description: Returns a list of all users.
   *     tags:
   *       - Get Users List
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: limit
   *         in: query
   *         description: Number of users to return per request.
   *         required: false
   *         type: string
   *       - name: offset
   *         in: query
   *         description: Number of users to skip before compiling the list.
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/NewUser'
   */
  .get(validateToken, adminsOnly, UsersController.getAllUsers)
  /**
   * @swagger
   * /api/users:
   *   post:
   *     description: Creates a new user.
   *     tags:
   *       - Create User
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: body
   *         description: User object.
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       200:
   *         description: response
   *         schema:
   *           type: object
   *           required:
   *             - token
   *             - user
   *           properties:
   *             token:
   *               type: string
   *             user:
   *               type: '#/definitions/NewUser'
   */
  .post(UsersController.signUp);

usersRouter.route('/:id')
  /**
   * @swagger
   * /api/users/<id>:
   *   get:
   *     description: Get a certain user's profile.
   *     tags:
   *       - Get User
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: id
   *         description: User id.
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/NewUser'
   */
  .get(validateToken, ownerOrAdminsOnly, UsersController.getUser)
  /**
   * @swagger
   * /api/users/<id>:
   *   put:
   *     description: Update a certain user's profile.
   *     tags:
   *       - Update User
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: id
   *         description: User id.
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: message
   *         schema:
   *           type: string
   */
  .put(validateToken, ownerOrAdminsOnly, UsersController.updateUserProfile)
  /**
   * @swagger
   * /api/users/<id>:
   *   delete:
   *     description: Delete a user.
   *     tags:
   *       - Delete User
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: id
   *         description: User id.
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: message
   *         schema:
   *           type: string
   */
  .delete(validateToken, ownerOrAdminsOnly, UsersController.deleteUser);

usersRouter.route('/:id/documents')
  /**
   * @swagger
   * /api/users/<id>/documents:
   *   get:
   *     description: Get a certain user's documents.
   *     tags:
   *       - Get User Documents
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: id
   *         description: User id.
   *         in: path
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: documents
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/NewDocument'
   */
  .get(validateToken, ownerOrAdminsOnly, UsersController.getUserDocuments);

usersRouter.route('/login')
  /**
   * @swagger
   * /api/users/login:
   *   post:
   *     description: Logs a user in.
   *     tags:
   *       - Login User
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: body
   *         description: User object
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/LoginUser'
   *     responses:
   *       200:
   *         description: response
   *         schema:
   *           type: object
   *           required:
   *             - token
   *             - user
   *           properties:
   *             token:
   *               type: string
   *             user:
   *               type: '#/definitions/NewUser'
   */
  .post(UsersController.login);

usersRouter.route('/logout')
  /**
   * @swagger
   * /api/users/logout:
   *   post:
   *     description: Logs a user out
   *     tags:
   *       - Logout User
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: message
   *         schema:
   *           type: string
   */
  .post(validateToken, UsersController.logout);

export default usersRouter;
