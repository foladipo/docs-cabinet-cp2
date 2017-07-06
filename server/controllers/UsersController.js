import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';

import { DEFAULT_ROLE_ID } from '../constants';
import { Document, User } from '../models/';
import getLimitAndOffset from '../util/getLimitAndOffset';
import isValidEmail from '../util/isValidEmail';
import isValidName from '../util/isValidName';
import isValidPassword from '../util/isValidPassword';

dotenv.config();

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
                  id: user.id,
                  username: user.username,
                  roleId: user.roleId,
                  firstName: user.firstName,
                  lastName: user.lastName
                };
                const token = JWT.sign(userDetails, process.env.JWT_PRIVATE_KEY, { expiresIn: '3d' });
                res.status(200).json({
                  message: 'Logged in successfully.',
                  token,
                  user: userDetails
                });
              } else {
                res.status(400)
                  .json({
                    message: 'Nope. That\'s not the correct password.',
                    error: 'IncorrectPasswordError'
                  });
              }
            } else {
              res.status(400)
                .json({
                  message: 'Yikes! You don\'t have an account yet. Please sign up, or check your login details.',
                  error: 'NonExistentUserError'
                });
            }
          });
        } else {
          res.status(400)
            .json({
              message: 'Please enter a valid email.',
              error: 'InvalidUsernameError'
            });
        }
      } else {
        res.status(400)
          .json({
            message: 'Sorry, you need to enter your password.',
            error: 'MissingPasswordError'
          });
      }
    } else {
      if (!password) {
        res.status(400)
          .json({
            message: 'Please enter your email and password to login.',
            error: 'MissingLoginDetailsError'
          });
        return;
      }
      res.status(400)
        .json({
          message: 'Sorry, you need to enter your email.',
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
        message: 'You\'re now logged out.'
      });
  }

  // TODO: Move some of this code to a validateNewUser middleware.
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

    // TODO: Move most of this validation logic to a middleware.
    const firstName = reqBody.firstName;
    if (firstName) {
      if (!isValidName(firstName)) {
        res.status(400)
          .json({
            message: 'Please enter a first name with at least two non-whitespace characters.',
            error: 'InvalidFirstNameError'
          });
        return;
      }
    } else {
      let errorType = 'MissingFirstNameError';
      const message = 'Please enter a first name with at least two non-whitespace characters.';
      if (firstName === '') {
        errorType = 'EmptyFirstNameError';
      }
      res.status(400)
        .json({
          message,
          error: errorType
        });
      return;
    }

    const lastName = reqBody.lastName;
    if (lastName) {
      if (!isValidName(lastName)) {
        res.status(400)
          .json({
            message: 'Please enter a last name with at least two non-whitespace characters.',
            error: 'InvalidLastNameError'
          });
        return;
      }
    } else {
      let errorType = 'MissingLastNameError';
      const message = 'Please enter a last name with at least two non-whitespace characters.';
      if (lastName === '') {
        errorType = 'EmptyLastNameError';
      }
      res.status(400)
        .json({
          message,
          error: errorType
        });
      return;
    }

    const username = reqBody.username;
    if (username) {
      if (!isValidEmail(username)) {
        res.status(400)
          .json({
            message: 'Please enter a valid email.',
            error: 'InvalidUsernameError'
          });
        return;
      }
    } else {
      let errorType = 'MissingUsernameError';
      const message = 'Please enter a valid email.';
      if (username === '') {
        errorType = 'EmptyUsernameError';
      }
      res.status(400)
        .json({
          message,
          error: errorType
        });
      return;
    }

    const password = reqBody.password;
    if (password) {
      if (!isValidPassword(password)) {
        res.status(400)
          .json({
            message: 'Please enter a strong password to sign up.',
            error: 'InvalidPasswordError'
          });
        return;
      }
    } else {
      let errorType = 'MissingPasswordError';
      const message = 'Please enter a strong password to sign up.';
      if (password === '') {
        errorType = 'EmptyPasswordError';
      }
      res.status(400)
        .json({
          message,
          error: errorType
        });
      return;
    }

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
            message: 'This email is taken. Please use another one.',
            error: 'UserExistsError'
          });
        } else {
          const saltLength = Number(process.env.PASSWORD_SALT_LENGTH);
          const hashedPassword = bcryptjs.hashSync(password, saltLength);
          const trimmedFirstname = firstName.trim().replace(/(\s{2,})/, ' ');
          const trimmedLastname = lastName.trim().replace(/(\s{2,})/, ' ');
          User
            .create({
              firstName: trimmedFirstname,
              lastName: trimmedLastname,
              username,
              password: hashedPassword,
              roleId: DEFAULT_ROLE_ID
            })
            .then((createdUser) => {
              const userDetails = {
                id: createdUser.id,
                username: createdUser.username,
                roleId: createdUser.roleId,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName
              };
              const token = JWT.sign(userDetails, process.env.JWT_PRIVATE_KEY, { expiresIn: '3d' });
              res.status(200).json({
                message: 'Signed up successfully.',
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
          message: 'Please supply the id of the account you want to update.',
          error: 'UserIdNotSuppliedError'
        });
      return;
    }

    const targetUserId = Number(targetUserIdString);
    if (Number.isNaN(targetUserId)) {
      res.status(400)
        .json({
          message: 'The user id you supplied is not a number.',
          error: 'InvalidUserIdError'
        });
      return;
    }

    if (targetUserId !== profileOfUpdater.id
      && profileOfUpdater.roleId < 1) {
      res.status(403)
        .json({
          message: 'You\'re not permitted to update this account.',
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

    // Explicitly checking for when newProfile.roleId is undefined is necessary.
    // Not doing so introduces some (almost) latent bugs.
    if (newProfile.roleId !== undefined) {
      if (typeof newProfile.roleId === 'number') {
        if (profileOfUpdater.roleId < 1) {
          res.status(403)
            .json({
              message: 'You, a regular user, cannot change your role or that of another user.',
              error: 'ForbiddenOperationError'
            });
          return;
        }
        profile.roleId = Number.parseInt(newProfile.roleId, 10);
      } else {
        res.status(400)
          .json({
            message: 'The new role you supplied for this account is invalid.',
            error: 'InvalidNewRoleIdError'
          });
        return;
      }
    }

    User.update(
      profile,
      {
        where: { id: targetUserId },
        returning: true
      }
    )
    .then((rows) => {
      const rowsAffected = rows[0];
      const updatedProfile = rows[1][0].dataValues;
      if (rowsAffected > 0) {
        res.status(200)
          .json({
            message: 'Account updated.',
            users: [{
              id: updatedProfile.id,
              firstName: updatedProfile.firstName,
              lastName: updatedProfile.lastName,
              username: updatedProfile.username,
              roleId: updatedProfile.roleId,
            }]
          });
      } else {
        res.status(404)
          .json({
            message: 'The account you tried to update doesn\'t exist.',
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
          message: 'Please supply the id of the account you want to modify.',
          error: 'UserIdNotSuppliedError'
        });
      return;
    }

    const targetUserId = Number(targetUserIdString);
    if (Number.isNaN(targetUserId)) {
      res.status(400)
        .json({
          message: 'The user id you supplied is not a number.',
          error: 'InvalidUserIdError'
        });
      return;
    }

    if (targetUserId === userProfile.id) {
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
                message: 'It\'s a pity, but you successfully deleted that account.'
              });
          } else {
            res.status(404)
              .json({
                message: 'The account you tried to delete doesn\'t exist.',
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
            if (userProfile.roleId > 0) {
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
                        message: 'It\'s a pity, but you successfully deleted that account.',
                        users: [{
                          id: user.id,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          username: user.username,
                          roleId: user.roleId
                        }]
                      });
                  } else {
                    res.status(404)
                      .json({
                        message: 'The account you tried to delete doesn\'t exist.',
                        error: 'TargetUserNotFoundError'
                      });
                  }
                });
            } else {
              res.status(403)
                .json({
                  message: 'You\'re not permitted to modify this account.',
                  error: 'ForbiddenOperationError'
                });
            }
          } else {
            res.status(404)
              .json({
                message: 'The account you tried to delete doesn\'t exist.',
                error: 'TargetUserNotFoundError'
              });
          }
        });
    }
  }

  /**
   * Returns all the documents for the user identified by a certain id. Some
   * details about this function's behaviour are:
   * - if the id is not a valid integer, it returns an InvalidUserIdError
   * response.
   * - if the id and path are valid but the id belongs to a non-existing user,
   * it sends a TargetUserNotFoundError response.
   * - if the user with the given id hasn't created any documents, it sends
   * a response with an empty array of documents.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g query parameters, headers etc.
   * @param {Response} res - An express Response object with the info this app
   * will send back to the user e.g a list of a user's documents, error,
   * messages like InvalidUserIdError, UnrecognizedPathError etc.
   * @return {void}
   */
  static getUserDocuments(req, res) {
    const pathInfo = req.path.split('/');
    const idString = pathInfo[1];

    const id = Number(idString);
    if (Number.isNaN(id)) {
      res.status(400)
        .json({
          message: 'The user id you supplied is not a number.',
          error: 'InvalidUserIdError'
        });
      return;
    }

    User
      .findOne({ where: { id } })
      .then((foundUser) => {
        if (foundUser) {
          Document
            .findAll({
              where: {
                authorId: id
              },
              attributes: ['id', 'title', 'content', 'access', 'categories', 'tags', 'createdAt', 'authorId'],
              order: [['createdAt', 'DESC']],
              returning: true
            })
            .then((docsAndMetadata) => {
              const docs = docsAndMetadata.map(doc => doc.dataValues);
              res.status(200)
                .json({
                  message: 'Documents found.',
                  documents: docs
                });
            });
        } else {
          res.status(404)
            .json({
              message: 'The account you asked for doesn\'t exist.',
              error: 'TargetUserNotFoundError'
            });
        }
      });
  }

  /**
   * Returns the profile of the user with a particular id. Other details about this
   * function's behaviour are:
   * - if the id is not a valid integer, it returns an InvalidUserIdError
   * response.
   * - if the id belongs to a non-existing user, it returns a TargetUserNotFoundError.
   * @param {Request} req - An express Request object with data about the
   * original request sent to this endpoint e.g query parameters, headers etc.
   * @param {Response} res - An express Response object with the info this app
   * will send back to the user e.g a user's profile, error messages like
   * TargetUserNotFoundError, InvalidUserIdError etc.
   * @return {void}
   */
  static getUser(req, res) {
    const pathInfo = req.path.split('/');
    const idString = pathInfo[1];

    const id = Number(idString);
    if (Number.isNaN(id)) {
      res.status(400)
        .json({
          message: 'The user id you supplied is not a number.',
          error: 'InvalidUserIdError'
        });
      return;
    }

    User
      .findOne({ where: { id } })
      .then((foundUser) => {
        if (foundUser) {
          const profile = {
            id: foundUser.id,
            username: foundUser.username,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            roleId: foundUser.roleId
          };
          res.status(200)
            .json({
              message: 'User found.',
              users: [profile]
            });
        } else {
          res.status(404)
            .json({
              message: 'The account you asked for doesn\'t exist.',
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

    const currentUserId = req.decodedUserProfile.id;
    User
      .findAll({
        where: {
          id: {
            ne: currentUserId
          }
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset
      })
      .then((foundUsers) => {
        const results = foundUsers.map(user => ({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId
        }));
        res.status(200)
          .json({
            message: 'Users found.',
            users: results
          });
      });
  }
}
