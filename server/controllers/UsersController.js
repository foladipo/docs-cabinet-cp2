import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';

import Document from '../models/Document';
import User from '../models/User';
import getLimitAndOffset from '../util/getLimitAndOffset';
import isValidEmail from '../util/isValidEmail';
import isValidName from '../util/isValidName';
import isValidPassword from '../util/isValidPassword';

dotenv.config();

// TODO: De-link getUserDocuments, getUser and getAllUsers, at least in
// the JSDoc of each.

/**
 * Defines the controller for the /users route.
 * @export
 * @class UsersController
 */
export default class UsersController {
  /**
   * Confirms that any user trying to login supplies the right login
   * credentials. If so, it returns some info about the user's profile
   * and a JWT token for the user to interact with other parts/endpoints of
   * the app. Otherwise, it returns a response with a descriptive errror
   * message e.g NonExistentUserError, InvalidUsernameError etc.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g HTTP status codes,
   * JSON responses etc.
   * @return {void}
   */
  static login(req, res) {
    const reqBody = req.body;
    const username = reqBody.username;
    const password = reqBody.password;
    if (username) {
      if (password) {
        const lowerCaseUsername = username.toLowerCase();
        const trimmedUsername = lowerCaseUsername.trim();
        if (isValidEmail(trimmedUsername)) {
          User.findOne({
            where: {
              username
            }
          }).then((user) => {
            if (user) {
              const storedPasswordHash = user.password;
              const isCorrectPassword = bcryptjs.compareSync(password, storedPasswordHash);
              if (isCorrectPassword) {
                const userDetails = {
                  userId: user.id,
                  username: user.username,
                  roleId: user.roleId,
                  firstName: user.firstName,
                  lastName: user.lastName
                };
                const token = JWT.sign(userDetails, process.env.JWT_PRIVATE_KEY, { expiresIn: '3d' });
                res.status(200).json({
                  user: userDetails,
                  token
                });
              } else {
                res.status(400)
                  .json({
                    error: 'IncorrectPasswordError'
                  });
              }
            } else {
              res.status(400)
                .json({
                  error: 'NonExistentUserError'
                });
            }
          });
        } else {
          res.status(400)
            .json({
              error: 'InvalidUsernameError'
            });
        }
      } else {
        res.status(400)
          .json({
            error: 'MissingPasswordError'
          });
      }
    } else {
      if (!password) {
        res.status(400)
          .json({
            error: 'MissingLoginDetailsError'
          });
        return;
      }
      res.status(400)
        .json({
          error: 'MissingUsernameError'
        });
    }
  }

  /**
   * Logs out any user that has a validated token.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g error messages.
   * @return {void}
   */
  static logout(req, res) {
    res.status(200)
      .json({
        message: 'LogoutSucceeded'
      });
  }

  /**
   * Ensures that a user trying to create a new account supplies all necessary
   * data. It also enforces some standards e.g the length and composition of the
   * password, whether the username is a valid email address, whether the
   * username hasn't been used to register before etc. If all these checks are
   * passed, this function creates a new user in this app's database and returns
   * a JWT token for the user to interact with other parts/endpoints of the app,
   * along with some info about the user's profile. Otherwise, it returns a response
   * with a descriptive errror message e.g InvalidPasswordError, InvalidUsernameError
   * etc.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g error messages, JWT tokens,
   * HTTP status codes etc.
   * @return {void}
   */
  static signUp(req, res) {
    const reqBody = req.body;

    const firstName = reqBody.firstName;
    if (firstName) {
      if (!isValidName(firstName)) {
        res.status(400)
          .json({
            error: 'InvalidFirstNameError'
          });
        return;
      }
    } else {
      let errorType = 'MissingFirstNameError';
      if (firstName === '') {
        errorType = 'EmptyFirstNameError';
      }
      res.status(400)
        .json({
          error: errorType
        });
      return;
    }

    const lastName = reqBody.lastName;
    if (lastName) {
      if (!isValidName(lastName)) {
        res.status(400)
          .json({
            error: 'InvalidLastNameError'
          });
        return;
      }
    } else {
      let errorType = 'MissingLastNameError';
      if (lastName === '') {
        errorType = 'EmptyLastNameError';
      }
      res.status(400)
        .json({
          error: errorType
        });
      return;
    }

    const username = reqBody.username;
    if (username) {
      if (!isValidEmail(username)) {
        res.status(400)
          .json({
            error: 'InvalidUsernameError'
          });
        return;
      }
    } else {
      let errorType = 'MissingUsernameError';
      if (username === '') {
        errorType = 'EmptyUsernameError';
      }
      res.status(400)
        .json({
          error: errorType
        });
      return;
    }

    const password = reqBody.password;
    if (password) {
      if (!isValidPassword(password)) {
        res.status(400)
          .json({
            error: 'InvalidPasswordError'
          });
        return;
      }
    } else {
      let errorType = 'MissingPasswordError';
      if (password === '') {
        errorType = 'EmptyPasswordError';
      }
      res.status(400)
        .json({
          error: errorType
        });
      return;
    }

    const roleId = Number(process.env.DEFAULT_ROLE);
    User
      .findOne({
        where: {
          username
        }
      })
      .then((user) => {
        if (user) {
          res.status(400)
          .json({
            error: 'UserExistsError'
          });
        } else {
          const saltLength = Number(process.env.PASSWORD_SALT_LENGTH);
          const hashedPassword = bcryptjs.hashSync(password, saltLength);
          User
            .create({
              firstName,
              lastName,
              username,
              password: hashedPassword,
              roleId
            })
            .then((createdUser) => {
              const userDetails = {
                userId: createdUser.id,
                username: createdUser.username,
                roleId: createdUser.roleId,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName
              };
              const token = JWT.sign(userDetails, process.env.JWT_PRIVATE_KEY, { expiresIn: '3d' });
              res.status(200).json({
                user: userDetails,
                token
              });
            });
        }
      });
  }

  /**
   * Updates the profile of a user in this app's database. Before performing
   * the update, this function checks that:
   * - the request includes the id of the user whose profile is to be updated.
   * - the included id belongs to an existing user of this app. In other
   * words, the given id must not belong to a user account that has not been
   * created or that has been deleted.
   * - the person performing this request is trying to update his/her own
   * account or is an admin. If not, it sends a ForbiddenOperationError
   * response.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint.
   * @param {Response} res - An express Response object that will contain
   * the info this app will send back to the user e.g error messages for
   * failed updates etc.
   * @return {void}
   */
  static updateUserProfile(req, res) {
    const profileOfUpdater = req.decodedUserProfile;
    const newProfile = req.body;
    const targetUserIdString = req.path.split('/')[1];
    if (targetUserIdString === undefined || targetUserIdString === '') {
      res.status(400)
        .json({
          error: 'UserIdNotSuppliedError'
        });
      return;
    }

    const targetUserId = Number(targetUserIdString);
    if (Number.isNaN(targetUserId)) {
      res.status(400)
        .json({
          error: 'InvalidUserIdError'
        });
      return;
    }

    if (targetUserId !== profileOfUpdater.userId
      && profileOfUpdater.roleId < 1) {
      res.status(403)
        .json({
          error: 'ForbiddenOperationError'
        });
      return;
    }

    const profile = {};
    if (newProfile.firstName) {
      profile.firstName = newProfile.firstName;
    }
    if (newProfile.lastName) {
      profile.lastName = newProfile.lastName;
    }
    if (newProfile.username) {
      profile.username = newProfile.username;
    }
    if (newProfile.password) {
      const saltLength = Number(process.env.PASSWORD_SALT_LENGTH);
      profile.password = bcryptjs.hashSync(newProfile.password, saltLength);
    }

    // TODO: Return the new profile of the user if this update succeeds.
    User.update(
      profile,
      {
        where: { id: targetUserId },
        returning: true
      }
    )
    .then((rows) => {
      const rowsAffected = rows[0];
      if (rowsAffected > 0) {
        res.status(200)
          .json({
            message: 'UpdateSucceeded'
          });
      } else {
        res.status(404)
          .json({
            error: 'TargetUserNotFoundError'
          });
      }
    });
  }

  /**
   * Deletes a user identified by his/her id in the database after performing
   * various checks. These checks include ensuring:
   * - that the id of the user to be deleted was stated as a query string for
   * the HTTP request.
   * - it deletes a user only if the user id from the (previously) decoded
   * token is the same as that supplied in the HTTP request's query string. In
   * other words, if a user is trying to delete his/her own account, this
   * function does that for him/her.
   * - that, otherwise, a user Janet trying to delete another user Lucy has a
   * higher role than the doomed user. So, for example, an admin might want to
   * delete a regular user for disobeying the Terms and Conditions of this app.
   * - that it only returns a success message IF a user was actually deleted.
   * Else, it returns a descriptive error message.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g query parameters, headers.
   * @param {Response} res - An express Response object that with
   * the info this app will send back to the user e.g error messages.
   * @return {void}
   */
  static deleteUser(req, res) {
    const userProfile = req.decodedUserProfile;

    const targetUserIdString = req.path.split('/')[1];
    if (targetUserIdString === undefined || targetUserIdString === '') {
      res.status(400)
        .json({
          error: 'UserIdNotSuppliedError'
        });
      return;
    }

    const targetUserId = Number(targetUserIdString);
    if (Number.isNaN(targetUserId)) {
      res.status(400)
        .json({
          error: 'InvalidUserIdError'
        });
      return;
    }

    if (targetUserId === userProfile.userId) {
      User
        .destroy({
          where: {
            id: targetUserId
          }
        })
        .then((userCount) => {
          if (userCount > 0) {
            res.status(200)
              .json({
                message: 'UserDeletionSucceeded'
              });
          } else {
            res.status(404)
              .json({
                error: 'TargetUserNotFoundError'
              });
          }
        });
    } else {
      User
        .findOne({
          where: {
            id: targetUserId
          }
        })
        .then((user) => {
          if (user) {
            if (userProfile.roleId > user.roleId) {
              User
                .destroy({
                  where: {
                    id: targetUserId
                  }
                })
                .then((userCount) => {
                  if (userCount > 0) {
                    res.status(200)
                      .json({
                        message: 'UserDeletionSucceeded'
                      });
                  } else {
                    res.status(404)
                      .json({
                        error: 'TargetUserNotFoundError'
                      });
                  }
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
                error: 'TargetUserNotFoundError'
              });
          }
        });
    }
  }

  /**
   * Returns all the documents for the user identified by a certain id. Some
   * details about this function's behaviour are:
   * - if a user id isn't supplied in the request's path or this isn't a
   * request for the documents path, this function calls the next middleware
   * function in the callback stack.
   * - if the id is not a valid integer, it returns an InvalidUserIdError
   * response.
   * - if the id is valid but the path after it isn't 'documents', it returns
   * a UnrecognizedPathError response. That is, the request must be made to
   * `/api/users/<id>/documents`.
   * - if the id and path are valid but the id belongs to a non-existing user,
   * it sends a TargetUserNotFoundError response.
   * - if the user with the given id hasn't created any documents, it sends
   * a response with an empty array of documents.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g query parameters, headers etc.
   * @param {Response} res - An express Response object with the info this app
   * will send back to the user e.g a list of a user's documents, error,
   * messages like InvalidUserIdError, UnrecognizedPathError etc.
   * @param {Function} next - The next function or middleware in the callback stack
   * of express.
   * @return {void}
   */
  static getUserDocuments(req, res, next) {
    const pathInfo = req.path.split('/');
    const userIdString = pathInfo[1];
    const documentPath = pathInfo[2];

    if (!(userIdString && documentPath)) {
      next();
      return;
    }

    const userId = Number(userIdString);
    if (Number.isNaN(userId)) {
      res.status(400)
        .json({
          error: 'InvalidUserIdError'
        });
      return;
    }

    if (documentPath !== 'documents') {
      res.status(400)
        .json({
          error: 'UnrecognizedPathError'
        });
      return;
    }

    User
      .findOne({ where: { id: userId } })
      .then((foundUser) => {
        if (foundUser) {
          Document
            .findAll({
              where: {
                createdBy: userId
              }
            })
            .then((docsAndMetadata) => {
              res.status(200)
                .json({
                  documents: [docsAndMetadata[0].dataValues]
                });
            });
        } else {
          res.status(404)
            .json({
              error: 'TargetUserNotFoundError'
            });
        }
      });
  }

  // TODO: Shouldn't users be able to get their own profile? Or should I
  // create a separate endpoint for that?
  /**
   * Returns the profile of the user with a particular id. Other details about this
   * function's behaviour are:
   * - if a user id isn't supplied in the request's path, this function calls
   * the next middleware function in the callback stack.
   * - if the id is not a valid integer, it returns an InvalidUserIdError
   * response.
   * - if the id belongs to a non-existing user, it returns a TargetUserNotFoundError.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g query parameters, headers etc.
   * @param {Response} res - An express Response object with the info this app
   * will send back to the user e.g a user's profile, error messages like
   * TargetUserNotFoundError, InvalidUserIdError etc.
   * @param {Function} next - The next function or middleware in the callback stack
   * of express.
   * @return {void}
   */
  static getUser(req, res, next) {
    const pathInfo = req.path.split('/');
    const userIdString = pathInfo[1];

    if (!userIdString) {
      next();
      return;
    }

    const userId = Number(userIdString);
    if (Number.isNaN(userId)) {
      res.status(400)
        .json({
          error: 'InvalidUserIdError'
        });
      return;
    }

    User
      .findOne({
        where: {
          id: userId
        }
      })
      .then((foundUser) => {
        if (foundUser) {
          const profile = {
            userId: foundUser.id,
            username: foundUser.username,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            roleId: foundUser.roleId
          };
          res.status(200)
            .json({
              users: [profile]
            });
        } else {
          res.status(404)
            .json({
              error: 'TargetUserNotFoundError'
            });
        }
      });
  }

  /**
   * Returns a list of the users of this app. In the query parameters of your
   * HTTP request, you can specify a limit (number of users returned for each
   * request) and an offset (e.g if there are 50 users and an offset of 5 is
   * given, then the list of returned users will start from the 6th user in
   * the database). The default limit is 30 and the default offset is 0. These
   * defaults can be customized by specifying DEFAULT_LIMIT_OF_RESULTS and
   * DEFAULT_OFFSET_OF_RESULTS in your `.env` file.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g query parameters, headers etc.
   * @param {Response} res - An express Response object with the info this app
   * will send back to the user e.g a list of users etc.
   * @return {void}
   */
  static getAllUsers(req, res) {
    const limitAndOffset = getLimitAndOffset(req.query.limit, req.query.offset);
    const limit = limitAndOffset.limit;
    const offset = limitAndOffset.offset;

    const currentUserId = req.decodedUserProfile.userId;
    User
      .findAll({
        where: {
          id: {
            ne: currentUserId
          }
        },
        limit,
        offset
      })
      .then((foundUsers) => {
        const results = foundUsers.map(user => ({
          userId: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId
        }));
        res.status(200)
          .json({ users: results });
      });
  }
}
