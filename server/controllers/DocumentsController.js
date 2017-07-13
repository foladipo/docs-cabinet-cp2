import _ from 'lodash';
import { Document, User } from '../models/';
import getLimitAndOffset from '../util/getLimitAndOffset';

/**
 * Defines the controller for the /api/documents route.
 * @export
 * @class DocumentsController
 */
export default class DocumentsController {
  /**
   * Creates a new document for a particular user.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g document title, content etc.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g success or error
   * messages.
   * @return {void}
   */
  static createDocument(req, res) {
    const reqBody = req.body;
    const title = reqBody.title;
    const content = reqBody.content;
    const access = reqBody.access.toLowerCase();
    const categories = reqBody.categories;
    const tags = reqBody.tags;

    const authorId = req.decodedUserProfile.id;

    const newDocument = {
      title,
      content,
      access,
      categories,
      tags,
      authorId
    };
    Document
      .create(newDocument)
      .then((createdDocument) => {
        res.status(200)
          .json({
            message: 'Your document was successfully created.',
            documents: [{
              id: createdDocument.id,
              title: createdDocument.title,
              content: createdDocument.content,
              access: createdDocument.access,
              categories: createdDocument.categories,
              tags: createdDocument.tags,
              createdAt: createdDocument.createdAt,
              authorId: createdDocument.authorId
            }]
          });
      });
  }

  /**
   * Sends an authenticated user a document identified by a particular id.
   * Other details include:
   * - if the specified id is invalid, it sends an InvalidTargetDocumentIdError
   * response. The id is invalid if it cannot be parsed to an integer.
   * - if the requested document has an access type that does not fit the
   * role of user making this request, this function sends a
   * ForbiddenOperationError response.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the identified document, error messages, HTTP status codes etc.
   * @return {void}
   */
  static getDocument(req, res) {
    const pathInfo = req.path.split('/');
    const documentIdString = pathInfo[1];

    const documentId = Number.parseInt(documentIdString, 10);
    if (Number.isNaN(documentId)) {
      res.status(400)
        .json({
          message: 'The document id you supplied is not a valid number.',
          error: 'InvalidTargetDocumentIdError'
        });
      return;
    }

    const requesterId = req.decodedUserProfile.id;

    Document
      .findOne({
        where: {
          id: documentId
        },
        attributes: ['id', 'title', 'content', 'access', 'categories', 'tags', 'createdAt', 'authorId']
      })
      .then((foundDocument) => {
        if (foundDocument) {
          if (foundDocument.authorId === requesterId) {
            res.status(200)
              .json({
                message: 'Document found.',
                documents: [foundDocument]
              });
          } else {
            res.status(403)
              .json({
                message: 'Nope. You\'re not permitted to access this document.',
                error: 'ForbiddenOperationError'
              });
          }
        } else {
          res.status(404)
            .json({
              message: 'The document you requested for doesn\'t exist.',
              error: 'NoDocumentFoundError'
            });
        }
      });
  }

  /**
   * Sends an authenticated user a list of documents.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the list of documents available and other data e.g HTTP status codes etc.
   * @return {void}
   */
  static getAllDocuments(req, res) {
    const limitAndOffset = getLimitAndOffset(req.query.limit, req.query.offset);
    const limit = limitAndOffset.limit;
    const offset = limitAndOffset.offset;
    const id = req.decodedUserProfile.id;

    /*
    page: current page of the query result based on limit and offset
    page_count: total number of pages
    page_size: number of records per page (based on limit)
    total_count: total number of records based on query
    */
    Document
      .findAndCountAll({
        include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'roleId'] }],
        where: {
          $or: [
            { access: 'public' },
            { authorId: id },
            {
              $and: [
                { access: 'role' },
                { '$User.roleId$': req.decodedUserProfile.roleId }
              ]
            }
          ]
        },
        attributes: ['id', 'title', 'content', 'access', 'categories', 'tags', 'createdAt', 'authorId'],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })
      .then((foundDocumentsMetadata) => {
        const pageSize = limit;
        const totalCount = foundDocumentsMetadata.count;
        const pageCount = Math.ceil(totalCount / pageSize);
        const page =
          1 + Math.floor((((limit * pageCount) + offset) - totalCount) / limit);
        const foundDocuments = foundDocumentsMetadata.rows;
        res.status(200)
          .json({
            message: 'Documents found.',
            pageSize,
            totalCount,
            pageCount,
            page,
            documents: foundDocuments
          });
      });
  }

  /**
   * Updates a document's title, content, access type, categories or tags.
   * Before performing the update, this function checks that:
   * - the included document id is valid, else it sends an
   * InvalidTargetDocumentIdError response. A document id is invalid if it
   * is not an integer.
   * - the included document id belongs to an existing document in this app,
   * else it sends a TargetDocumentNotFoundError response.
   * - the person performing this request is the one who initially created the
   * document. Else, it sends a ForbiddenOperationError response.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g error messages for
   * failed updates etc.
   * @return {void}
   */
  static updateDocument(req, res) {
    const userProfile = req.decodedUserProfile;
    const documentUpdate = req.body;

    const documentIdString = req.path.split('/')[1];

    const documentId = Number.parseInt(documentIdString, 10);
    if (Number.isNaN(documentId)) {
      res.status(400)
        .json({
          message: 'The document id you supplied is not a number.',
          error: 'InvalidTargetDocumentIdError'
        });
      return;
    }

    if (!documentUpdate || _.isEqual(documentUpdate, {})) {
      res.status(400)
        .json({
          message: 'You didn\'t supply any info for the update.',
          error: 'EmptyDocumentBodyError'
        });
      return;
    }

    Document
      .findById(documentId)
      .then((foundDocument) => {
        if (foundDocument) {
          const updaterId = userProfile.id;
          if (foundDocument.authorId === updaterId) {
            const document = {};
            if (documentUpdate.title) {
              document.title = documentUpdate.title;
            }
            if (documentUpdate.content) {
              document.content = documentUpdate.content;
            }
            if (documentUpdate.access) {
              document.access = documentUpdate.access;
            }
            if (documentUpdate.categories) {
              document.categories = documentUpdate.categories;
            }
            if (documentUpdate.tags) {
              document.tags = documentUpdate.tags;
            }

            Document
              .update(document, {
                where: {
                  id: documentId
                },
                returning: true
              })
              .then((docs) => {
                const updatedDocument = docs[1][0];
                res.status(200)
                  .json({
                    message: 'Document updated.',
                    documents: [{
                      id: updatedDocument.id,
                      title: updatedDocument.title,
                      content: updatedDocument.content,
                      access: updatedDocument.access,
                      categories: updatedDocument.categories,
                      tags: updatedDocument.tags,
                      createdAt: updatedDocument.createdAt,
                      authorId: updatedDocument.authorId,
                    }]
                  });
              });
          } else {
            res.status(403)
              .json({
                message: 'Halt! You cannot modify this document.',
                error: 'ForbiddenOperationError'
              });
          }
        } else {
          res.status(404)
            .json({
              message: 'The document you tried to update doesn\'t exist.',
              error: 'TargetDocumentNotFoundError'
            });
        }
      });
  }

  /**
   * Delete a document. Before performing the update, this function checks
   * that:
   * - the included document id is valid, else it sends an
   * InvalidTargetDocumentIdError response. A document id is invalid if it
   * is not an integer.
   * - the included document id belongs to an existing document in this app,
   * else it sends a TargetDocumentNotFoundError response.
   * - the person performing this request is either the one who initially
   * created the document or an admin. Else, it sends a
   * ForbiddenOperationError response.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g error messages for
   * failed updates etc.
   * @return {void}
   */
  static deleteDocument(req, res) {
    const userProfile = req.decodedUserProfile;
    const documentIdString = req.path.split('/')[1];

    const documentId = Number.parseInt(documentIdString, 10);
    if (Number.isNaN(documentId)) {
      res.status(400)
        .json({
          message: 'The document id you supplied is not a number.',
          error: 'InvalidTargetDocumentIdError'
        });
      return;
    }

    Document
      .findById(documentId)
      .then((foundDocument) => {
        if (foundDocument) {
          const deleterId = userProfile.id;
          if (foundDocument.authorId === deleterId || userProfile.roleId > 0) {
            Document
              .destroy({
                where: {
                  id: documentId
                }
              })
              .then(() => {
                res.status(200)
                  .json({
                    message: 'Document deleted.',
                    documents: [foundDocument]
                  });
              });
          } else {
            res.status(403)
              .json({
                message: 'Halt! You cannot modify this document.',
                error: 'ForbiddenOperationError'
              });
          }
        } else {
          res.status(404)
            .json({
              message: 'The document you tried to delete doesn\'t exist.',
              error: 'TargetDocumentNotFoundError'
            });
        }
      });
  }
}
