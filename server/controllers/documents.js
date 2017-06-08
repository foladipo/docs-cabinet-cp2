import express from 'express';
import Document from '../models/Document';
import validateToken from '../middleware/validateToken';

const documents = express();

/**
 * Checks whether a given access type is valid. That is, the said access type
 * is recognized by this app.
 * @param {String} someAccess - a string containing a possibly valid access
 * type for a document.
 * @returns {Boolean} - returns true if this is an access type recognized
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

function getDocument(req, res, next) {
  next();
}

/**
 * Sends an authenticated user a list of documents.
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint.
 * @param {Response} res - An express Response object that will contain
 * the list of documents available and other data e.g HTTP status codes,
 * JSON responses etc.
 * @return {void}
 */
function getAllDocuments(req, res) {
  res.status(200)
    .json({
      yippee: 'Here are all the documents.'
    });
}

/**
 * Creates a new document for a particular user. Some other details include:
 * - if the title, document content, access type, tags or categories of the new
 * document are not specified, it sends an error response that appropriately
 * describes what went wrong.
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
GET /documents/
GET /documents/?limit={integer}&offset={integer}
GET /documents/<id>
PUT /documents/<id>
DELETE /documents/<id>

*/
// TODO: Use app.all('/*', validateToken)?
// documents.get('/*', validateToken, getDocument, getAllDocuments);
documents.post('/*', validateToken, createDocument);

export default documents;
