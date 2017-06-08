import express from 'express';
import JWT from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Document from '../models/Document';
import adminsOnly from '../middleware/adminsOnly';
import validateToken from '../middleware/validateToken';
import getLimitAndOffset from '../util/getLimitAndOffset';

dotenv.config();

const users = express();

/**
 * Tests a given string to see if it is a valid name by this app's standards.
 * This means that it must:
 * - be a string.
 * - have more than two (2) characters.
 * - not contain any whitespace character.
 * @param {String} name - The string to test as being a valid name.
 * @return {Boolean} - Returns true if the string is a valid name. Otherwise,
 * it returns false.
 */
function isValidName(name) {
  if (typeof name === 'string' && name.length > 1) {
    const whitespaceCharacters = /\s/;
    if (whitespaceCharacters.test(name)) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Tests a given string to see if it is a valid email address.
 * @param {String} email - The string to test as being a valid email address.
 * @return {Boolean} - Returns true if the string is a valid email address.
 * Otherwise, it returns false.
 */
function isValidEmail(email) {
  const emailFormat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/;
  return emailFormat.test(email);
}

/**
 * Tests a given string to see if it is a valid password by this app's standards.
 * This means that it must:
 * - be a string.
 * - have more than eight (8) characters.
 * - have at least one lower case letter.
 * - have at least one upper case letter.
 * - have at least one number.
 * - have at least one symbol.
 * @param {String} password - The string to test as being a valid password.
 * @return {Boolean} - Returns true if the string is a valid password. Otherwise,
 * it returns false.
 */
function isValidPassword(password) {
  if (typeof password === 'string') {
    if (password.length < 8) {
      return false;
    }
    const passwordFormat =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(){};':"|,./<>?`~])/;
    return passwordFormat.test(password);
  }
  return false;
}

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
function login(req, res) {
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
function logout(req, res) {
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
function signUp(req, res) {
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

  const roleId = Number.parseInt(process.env.DEFAULT_ROLE, 10);
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
        const saltLength = Number.parseInt(process.env.PASSWORD_SALT_LENGTH, 10);
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
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint.
 * @param {Response} res - An express Response object that will contain
 * the info this app will send back to the user e.g error messages for
 * failed updates etc.
 * @return {void}
 */
function updateUserProfile(req, res) {
  const userProfile = req.decodedUserProfile;

  const userIdString = req.path.split('/')[1];
  if (userIdString === undefined) {
    res.status(400)
      .json({
        error: 'UserIdNotSuppliedError'
      });
    return;
  }

  const userId = Number.parseInt(userIdString, 10);
  if (Number.isNaN(userId)) {
    res.status(400)
      .json({
        error: 'InvalidUserIdError'
      });
    return;
  }

  const newProfile = {};
  if (userProfile.firstName) {
    newProfile.firstName = userProfile.firstName;
  }
  if (userProfile.lastName) {
    newProfile.lastName = userProfile.lastName;
  }
  if (userProfile.username) {
    newProfile.username = userProfile.username;
  }
  if (userProfile.password) {
    const saltLength = Number.parseInt(process.env.PASSWORD_SALT_LENGTH, 10);
    newProfile.password = bcryptjs.hashSync(userProfile.password, saltLength);
  }

  User.update(
    newProfile,
    {
      where: { id: userId },
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
          error: 'UserNotFoundError'
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
function deleteUser(req, res) {
  const userProfile = req.decodedUserProfile;

  const targetUserIdString = req.path.split('/')[1];
  if (targetUserIdString === undefined) {
    res.status(400)
      .json({
        error: 'UserIdNotSuppliedError'
      });
    return;
  }

  const targetUserId = Number.parseInt(targetUserIdString, 10);
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
              error: 'UserNotFoundError'
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
                      error: 'UserNotFoundError'
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
              error: 'UserNotFoundError'
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
 * - if the user with the given id hasn't created any documents or the given
 * id belongs to a non-existing user, it returns a response with an empty
 * array of documents.
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint e.g query parameters, headers etc.
 * @param {Response} res - An express Response object with the info this app
 * will send back to the user e.g a list of a user's documents, error,
 * messages like InvalidUserIdError, UnrecognizedPathError etc.
 * @param {Function} next - The next function or middleware in the callback stack
 * of express.
 * @return {void}
 */
function getUserDocuments(req, res, next) {
  const pathInfo = req.path.split('/');
  const userIdString = pathInfo[1];
  const documentPath = pathInfo[2];

  if (!(userIdString && documentPath)) {
    next();
    return;
  }

  const userId = Number.parseInt(userIdString, 10);
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

  Document
    .findAll({
      where: {
        createdBy: userId
      }
    })
    .then((docs) => {
      res.status(200)
        .json({
          userDocuments: docs
        });
    });
}

/**
 * Returns the profile of the user with a particular id. Other details about this
 * function's behaviour are:
 * - if a user id isn't supplied in the request's path, this function calls
 * the next middleware function in the callback stack.
 * - if the id is not a valid integer, it returns an InvalidUserIdError
 * response.
 * - if the id belongs to a non-existing user, it returns a UserNotFoundError.
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint e.g query parameters, headers etc.
 * @param {Response} res - An express Response object with the info this app
 * will send back to the user e.g a user's profile, error messages like
 * UserNotFoundError, InvalidUserIdError etc.
 * @param {Function} next - The next function or middleware in the callback stack
 * of express.
 * @return {void}
 */
function getUser(req, res, next) {
  const pathInfo = req.path.split('/');
  const userIdString = pathInfo[1];

  if (!userIdString) {
    next();
    return;
  }

  const userId = Number.parseInt(userIdString, 10);
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
          .json(profile);
      } else {
        res.status(404)
          .json({
            error: 'UserNotFoundError'
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
function getAllUsers(req, res) {
  const resultsLimitAndOffset = getLimitAndOffset(req.query.limit, req.query.offset);
  const resultsLimit = resultsLimitAndOffset.limit;
  const offset = resultsLimitAndOffset.offset;

  const currentUserId = req.decodedUserProfile.userId;
  User
    .findAll({
      where: {
        id: {
          ne: currentUserId
        }
      },
      limit: resultsLimit,
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
        .json(results);
    });
}

users.post('/login', login);
users.post('/logout', validateToken, logout);
users.post('/*', signUp);
users.put('/*', validateToken, updateUserProfile);
users.delete('/*', validateToken, deleteUser);
users.get('/*', validateToken, adminsOnly, getUserDocuments, getUser, getAllUsers);

export default users;
