import express from 'express';
import JWT from 'jsonwebtoken';

const documents = express();

/**
 * Sends an authenticated user a list of documents. If the user isn't
 * authenticated (i.e has no JWT token or has an invalid one), this function
 * returns a descriptive error message e.g InvalidTokenError.
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint.
 * @param {Response} res - An express Response object that will contain
 * the list of documents available and other data e.g HTTP status codes,
 * JSON responses etc.
 * @return {void}
 */
function getDocuments(req, res) {
  const token = req.headers['x-docs-cabinet-authentication'];
  if (token) {
    let decoded = {};
    try {
      decoded = JWT.verify(token, process.env.JWT_PRIVATE_KEY, { expiresIn: '3d' });
      res.status(200)
        .json({
          documents: []
        });
    } catch (err) {
      res.status(401)
        .json({
          error: 'InvalidTokenError'
        });
    }
  } else {
    res.status(401)
      .json({
        error: 'MissingTokenError'
      });
  }
}

documents.use('/', getDocuments);

export default documents;
