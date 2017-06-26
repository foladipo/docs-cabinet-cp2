import express from 'express';

import SearchController from '../controllers/SearchController';
import validateToken from '../middleware/validateToken';

const searchRouter = express.Router();
/**
 * @swagger
 * definitions:
 *   NewDocument:
 *     type: object
 *     required:
 *        - title
 *        - docContent
 *        - access
 *        - categories
 *        - tags
 *     properties:
 *        title:
 *           type: string
 *        docContent:
 *           type: string
 *        access:
 *            type: string
 *        categories:
 *            type: string
 *        tags:
 *            type: string
 *   Document:
 *      allOf:
 *        - $ref: '#definitions/NewDocument'
 *        - required:
 *        - id:
 *              type: integer
 *              format: int64
 */
searchRouter.route('/users')
  /**
   * @swagger
   * /api/search/users?q=<firstName|lastName>:
   *    get:
   *      description: Returns users identified by all or part of their first or last name.
   *      tags:
   *        - Finds a user by first or last name.
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: x-docs-cabinet-authentication
   *          in: header
   *          description: An authentication token.
   *          required: true
   *          type: string
   *        - in: query
   *          name: q
   *          description: First or last name of a registred user.
   *          required: true
   *          type: string
   *      responses:
   *        200:
   *          description: user
   *          schema:
   *            type: object
   */
  .get(validateToken, SearchController.searchUsers);

searchRouter.route('/documents')
  /**
   * @swagger
   * /api/search/documents?q=<title>:
   *    get:
   *      description: Returns documents identified by all or part of their title.
   *      tags:
   *        - Finds a document by title
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: x-docs-cabinet-authentication
   *          in: header
   *          description: An authentication token.
   *          required: true
   *          type: string
   *        - in: query
   *          name: q
   *          description: title of a document
   *          required: true
   *          type: string
   *      responses:
   *        200:
   *          description: user
   *          schema:
   *            type: array
   *            items:
   *              $ref: '#/definitions/NewDocument'
   */
  .get(validateToken, SearchController.searchDocuments);

export default searchRouter;
