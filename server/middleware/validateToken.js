import JWT from 'jsonwebtoken';
import User from '../models/User';

/**
 * Validates the token supplied to any HTTP request to a given route, before
 * passing on the request to the route itself. It validates the request's
 * token by ensuring that the request:
 * - includes a token.
 * - includes a valid token that was signed by this app.
 * - includes a valid token for a user that is actually registered with this
 * app. For example, a token was signed by this app for a certain user,
 * but the user subsequently deleted his/her account. This function ensures
 * that in such an event, the previously generated token is not accepted as valid.
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint e.g query parameters, headers, the
 * decoded payload of the JWT token etc.
 * @param {Response} res - An express Response object with the info this app
 * will send back to the user e.g error messages like MissingTokenError,
 * EmptyTokenError etc.
 * @param {Function} next - The next function or middleware in the callback stack
 * of express.
 * @return {void}
 */
export default function validateToken(req, res, next) {
  const token = req.headers['x-docs-cabinet-authentication'];
  if (token === undefined) {
    res.status(400)
      .json({
        error: 'MissingTokenError'
      });
    return;
  }
  if (token === '') {
    res.status(400)
      .json({
        error: 'EmptyTokenError'
      });
    return;
  }
  let userProfile;
  try {
    userProfile = JWT.verify(token, process.env.JWT_PRIVATE_KEY);
  } catch (err) {
    const errorType = err.name;
    if (errorType === 'TokenExpiredError') {
      res.status(401)
        .json({
          error: 'ExpiredTokenError'
        });
    } else {
      res.status(401)
      .json({
        error: 'InvalidTokenError'
      });
    }
    return;
  }

  /* Takes care of a token for a user who was previously registered and then
   deleted his/her account.
   */
  User
    .findOne({
      where: {
        id: userProfile.userId
      }
    })
    .then((foundUser) => {
      if (foundUser) {
        req.decodedUserProfile = userProfile;
        next();
      } else {
        res.status(401)
          .json({
            error: 'NonExistentUserError'
          });
      }
    });
}
