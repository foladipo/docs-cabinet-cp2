import express from 'express';
import Document from '../models/Document';
import User from '../models/User';
import validateToken from '../middleware/validateToken';
import getLimitAndOffset from '../util/getLimitAndOffset';

const documents = express();

/**
 * Checks whether a given access type is valid. That is, the said access type
 * is recognized by this app.
 * @param {String} someAccess - a string containing a possibly valid access
 * type for a document.
 * @return {Boolean} - returns true if this is an access type recognized
 * by this app and false if otherwise.
 */
function isValidAccessType(someAccess) {
  if (typeof someAccess !== 'string' || someAccess === '') {
    return false;
  }
  const access = someAccess.toLowerCase();
  const PERMITTED_ACCESS_TYPES = ['public', 'private', 'role'];
  if (PERMITTED_ACCESS_TYPES.indexOf(access) === -1) {
    return false;
  }

  return true;
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
function getDocument(req, res, next) {
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

  const userId = req.decodedUserProfile.userId;
  const roleId = req.decodedUserProfile.roleId;

  Document
    .findOne({
      where: {
        id: documentId
      }
    })
    .then((foundDocument) => {
      if (foundDocument) {
        if (foundDocument.access === 'public') {
          res.status(200)
            .json(foundDocument);
          return;
        }

        if (foundDocument.access === 'private') {
          if (userId === foundDocument.createdBy || roleId > 0) {
            res.status(200)
              .json(foundDocument);
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
function getAllDocuments(req, res) {
  const limitAndOffset = getLimitAndOffset(req.query.limit, req.query.offset);
  const limit = limitAndOffset.limit;
  const offset = limitAndOffset.offset;
  const userId = req.decodedUserProfile.userId;

  Document
    .findAll({
      where: {
        $or: [
          { access: 'public' },
          { createdBy: userId },
        ]
      },
      limit,
      offset
    })
    .then((foundDocuments) => {
      res.status(200)
        .json(foundDocuments);
    });
}

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
function createDocument(req, res) {
  const reqBody = req.body;

  let title;
  if (reqBody.title) {
    title = reqBody.title;
  } else {
    res.status(400)
      .json({
        error: 'MissingTitleError'
      });
    return;
  }

  let docContent;
  if (reqBody.docContent) {
    docContent = reqBody.docContent;
  } else {
    res.status(400)
      .json({
        error: 'MissingDocContentError'
      });
    return;
  }

  let access;
  if (reqBody.access) {
    access = reqBody.access.toLowerCase();
  } else {
    res.status(400)
      .json({
        error: 'MissingAccessError'
      });
    return;
  }

  if (!isValidAccessType(access)) {
    res.status(400)
      .json({
        error: 'InvalidAccessTypeError'
      });
    return;
  }

  let categories;
  if (reqBody.categories) {
    categories = reqBody.categories;
  } else {
    res.status(400)
      .json({
        error: 'MissingCategoriesError'
      });
    return;
  }

  let tags;
  if (reqBody.tags) {
    tags = reqBody.tags;
  } else {
    res.status(400)
      .json({
        error: 'MissingTagsError'
      });
    return;
  }

  const createdBy = req.decodedUserProfile.userId;
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
        docContent,
        access,
        categories,
        tags,
        createdBy
      };
      Document
        .create(newDocument)
        .then(() => {
          res.status(200)
            .json({
              message: 'DocumentCreationSucceeded'
            });
        });
    });
}

/*
PUT /documents/<id>
DELETE /documents/<id>
*/

// TODO: Use app.all('/*', validateToken)?
documents.get('/*', validateToken, getDocument, getAllDocuments);
documents.post('/*', validateToken, createDocument);

export default documents;
