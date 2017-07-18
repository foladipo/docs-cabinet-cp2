import express from 'express';

import DocumentsController from '../controllers/DocumentsController';
import validateNewDocument from '../middleware/validateNewDocument';
import validateToken from '../middleware/validateToken';

const documentsRouter = express.Router();
/**
 * @swagger
 * definitions:
 *   NewDocument:
 *     type: object
 *     required:
 *       - title
 *       - content
 *       - access
 *       - categories
 *       - tags
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
 *   Document:
 *     allOf:
 *       - $ref: '#definitions/NewDocument'
 *       - required:
 *       - id:
 *         type: integer
 *         format: int64
 */
documentsRouter.route('/')
  /**
   * @swagger
   * /api/documents:
   *   get:
   *     description: Returns all the documents in this app that this user is permitted to see.
   *     tags:
   *       - Get Documents List
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: documents
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/NewDocument'
   */
  .get(validateToken, DocumentsController.getAllDocuments)
  /**
   * @swagger
   * /api/documents:
   *   post:
   *     description: Creates a new document.
   *     tags:
   *       - Create Document
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: body
   *         description: Document object.
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/NewDocument'
   *     responses:
   *       200:
   *         description: response
   *         schema:
   *           type: object
   */
  .post(validateToken, validateNewDocument, DocumentsController.createDocument);

documentsRouter.route('/:id')
  /**
   * @swagger
   * /api/documents/<id>:
   *   get:
   *     description: Returns the document identified by id.
   *     tags:
   *       - Get document by id
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: id
   *         description: Document id.
   *         in:  path
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
  .get(validateToken, DocumentsController.getDocument)
  /**
   * @swagger
   * /api/documents/<id>:
   *   put:
   *     description: Updates the document identified by id.
   *     tags:
   *       - Update the document chosen by id.
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: x-docs-cabinet-authentication
   *         in: header
   *         description: An authentication token.
   *         required: true
   *         type: string
   *       - name: id
   *         description: Document id.
   *         in:  path
   *         required: true
   *         type: integer
   *       - name: body
   *         description: Document object.
   *         in:  body
   *         required: true
   *         type: string
   *         schema:
   *           $ref: '#/definitions/NewDocument'
   *     responses:
   *       200:
   *         description: message
   *         schema:
   *           type: string
   */
  .put(validateToken, DocumentsController.updateDocument)
  /**
   * @swagger
   * /api/document/<id>:
   *    delete:
   *      description: Deletes the document identified by id.
   *      tags:
   *        - Delete document
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: x-docs-cabinet-authentication
   *          in: header
   *          description: An authentication token.
   *          required: true
   *          type: string
   *        - name: id
   *          description: Document id.
   *          in: path
   *          required: true
   *          type: integer
   *      responses:
   *        200:
   *          description: users
   *          schema:
   *            type: array
   *            items:
   *              $ref: '#/definitions/Document'
   */
  .delete(validateToken, DocumentsController.deleteDocument);

export default documentsRouter;
