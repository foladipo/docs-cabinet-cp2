import _ from 'lodash';
import Document from '../models/Document';
import User from '../models/User';
import getLimitAndOffset from '../util/getLimitAndOffset';


// TODO: De-link getDocuments and getAllDocuments, at least in
// the JSDoc of each.

/**
 * Defines the controller for the /documents route.
 * @export
 * @class DocumentsController
 */
export default class DocumentsController {
  /**
   * Creates a new document for a particular user. Some other details include:
   * - if the title, document content, access type, tags or categories of the new
   * document are not specified, it sends an error response that appropriately
   * describes which field/info is missing.
   * - if the access type specified is not a value recognized by this app,
   * it sends an InvalidAccessTypeError response.
   * - if the user making this request has previously created a document with
   * the same title, it sends a DocumentExistsError response.
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

    const createdBy = req.decodedUserProfile.id;
    Document
      .findOne({
        where: {
          title,
          createdBy,
        }
      })
      .then((document) => {
        if (document) {
          res.status(409)
            .json({
              error: 'DocumentExistsError'
            });
          return;
        }

        const newDocument = {
          title,
          content,
          access,
          categories,
          tags,
          createdBy
        };
        Document
          .create(newDocument)
          .then((createdDocument) => {
            res.status(200)
              .json({
                message: 'DocumentCreationSucceeded',
                documents: [{
                  id: createdDocument.id,
                  title: createdDocument.title,
                  content: createdDocument.content,
                  access: createdDocument.access,
                  categories: createdDocument.categories,
                  tags: createdDocument.tags,
                  createdAt: createdDocument.createdAt,
                  createdBy: createdDocument.createdBy
                }]
              });
          });
      });
  }

  /**
   * Sends an authenticated user a document identified by a particular id.
   * Other details include:
   * - if an id is not given as part of the path of the HTTP request, it
   * calls next().
   * - if the specified id is invalid, it sends an InvalidDocumentIdError
   * response. The id is invalid if it cannot be parsed to an integer.
   * - if the requested document has an access type that does not fit the
   * role of user making this request, this function sends a
   * ForbiddenOperationError response.
   * - if the document belongs to a user that no longer exists, this function
   * sends an OrphanedDocumentError response.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the identified document, error messages, HTTP status codes etc.
   * @param {Function} next - The next function or middleware in the callback
   * stack of express.
   * @return {void}
   */
  static getDocument(req, res, next) {
    const pathInfo = req.path.split('/');
    const documentIdString = pathInfo[1];

    if (!documentIdString) {
      next();
      return;
    }

    const documentId = Number(documentIdString);
    if (Number.isNaN(documentId)) {
      res.status(400)
        .json({
          error: 'InvalidDocumentIdError'
        });
      return;
    }

    const id = req.decodedUserProfile.id;
    const roleId = req.decodedUserProfile.roleId;

    Document
      .findOne({
        where: {
          id: documentId
        },
        attributes: ['id', 'title', 'content', 'access', 'categories', 'tags', 'createdAt', 'createdBy']
      })
      .then((foundDocument) => {
        if (foundDocument) {
          if (foundDocument.access === 'public') {
            res.status(200)
              .json(foundDocument);
            return;
          }

          if (foundDocument.access === 'private') {
            if (id === foundDocument.createdBy || roleId > 0) {
              res.status(200)
                .json({ documents: [foundDocument] });
            } else {
              res.status(403)
                .json({
                  error: 'ForbiddenOperationError'
                });
            }
            return;
          }

          if (foundDocument.access === 'role') {
            User
              .findOne({
                where: {
                  id: foundDocument.createdBy
                },
                attributes: ['id', 'roleId']
              })
              .then((foundAuthor) => {
                // TODO: This is a hotfix. There should be a default action
                // for documents whose author has unregistered/been deleted.
                // Probably make delete them all.
                if (foundAuthor) {
                  if (foundAuthor.roleId === roleId) {
                    res.status(200)
                      .json(foundDocument);
                  } else {
                    res.status(403)
                      .json({
                        error: 'ForbiddenOperationError'
                      });
                  }
                } else {
                  res.status()
                    .json({
                      error: 'OrphanedDocumentError'
                    });
                }
              });
          }
        } else {
          res.status(404)
            .json({
              error: 'NoDocumentsFoundError'
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

    Document
      .findAll({
        // TODO: Add restrictions for 'role' and admin access of private
        // files, using hasMany(), belongsTo() etc.
        where: {
          $or: [
            { access: 'public' },
            { createdBy: id },
          ]
        },
        attributes: ['id', 'title', 'content', 'access', 'categories', 'tags', 'createdAt', 'createdBy'],
        limit,
        offset
      })
      .then((foundDocuments) => {
        res.status(200)
          .json({ documents: foundDocuments });
      });
  }

  /**
   * Updates a document's content, access type, categories or tags. Before
   * performing the update, this function checks that:
   * - the HTTP request includes the id of the document that is to be updated.
   * Else, it sends a DocumentIdNotSuppliedError response.
   * - the included document id is valid, else it sends an InvalidDocumentIdError
   * response. A document id is invalid if it is not an integer.
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
    if (documentIdString === undefined || documentIdString === '') {
      res.status(400)
        .json({
          error: 'DocumentIdNotSuppliedError'
        });
      return;
    }

    const documentId = Number(documentIdString);
    if (Number.isNaN(documentId)) {
      res.status(400)
        .json({
          error: 'InvalidDocumentIdError'
        });
      return;
    }

    if (!documentUpdate || _.isEqual(documentUpdate, {})) {
      res.status(400)
        .json({
          error: 'EmptyDocumentBodyError'
        });
    }

    Document
      .findById(documentId)
      .then((foundDocument) => {
        if (foundDocument) {
          const updaterId = userProfile.id;
          if (foundDocument.createdBy === updaterId) {
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
                    message: 'DocumentUpdateSucceeded',
                    documents: [{
                      id: updatedDocument.id,
                      title: updatedDocument.title,
                      content: updatedDocument.content,
                      access: updatedDocument.access,
                      categories: updatedDocument.categories,
                      tags: updatedDocument.tags,
                      createdAt: updatedDocument.createdAt,
                      createdBy: updatedDocument.createdBy,
                    }]
                  });
              });
          } else {
            res.status(403)
              .json({
                error: 'ForbiddenOperationError'
              });
          }
        } else {
          res.status(404)
            .json({
              error: 'TargetDocumentNotFoundError'
            });
        }
      });
  }

  /**
   * Delete a document. Before performing the update, this function checks
   * that:
   * - the HTTP request includes the id of the document that is to be deleted.
   * Else, it sends a DocumentIdNotSuppliedError response.
   * - the included document id is valid, else it sends an InvalidDocumentIdError
   * response. A document id is invalid if it is not an integer.
   * - the included document id belongs to an existing document in this app,
   * else it sends a TargetDocumentNotFoundError response.
   * - the person performing this request is either the one who initially created the
   * document or an admin. Else, it sends a ForbiddenOperationError response.
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
    if (documentIdString === undefined || documentIdString === '') {
      res.status(400)
        .json({
          error: 'DocumentIdNotSuppliedError'
        });
      return;
    }

    const documentId = Number(documentIdString);
    if (Number.isNaN(documentId)) {
      res.status(400)
        .json({
          error: 'InvalidDocumentIdError'
        });
      return;
    }

    Document
      .findById(documentId)
      .then((foundDocument) => {
        if (foundDocument) {
          const deleterId = userProfile.id;
          if (foundDocument.createdBy === deleterId || userProfile.roleId > 0) {
            Document
              .destroy({
                where: {
                  id: documentId
                }
              })
              .then(() => {
                res.status(200)
                  .json({
                    message: 'DocumentDeleteSucceeded'
                  });
              });
          } else {
            res.status(403)
              .json({
                error: 'ForbiddenOperationError'
              });
          }
        } else {
          res.status(404)
            .json({
              error: 'TargetDocumentNotFoundError'
            });
        }
      });
  }
}
