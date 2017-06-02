import express from 'express';
import JWT from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const users = express();

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
 * Logs a user out after confirming that he/she is currently
 * logged in. If this isn't true because the user didnt supply a token,
 * the token has expired etc, this function responds with a descriptive
 * error message e.g MissingTokenError, ExpiredTokenError etc.
 * @param {Request} req - An express Request object with data about the
 * original request sent to this endpoint.
 * @param {Response} res - An express Response object that will contain
 * the info this app will send back to the user e.g error messages.
 * @return {void}
 */
function logout(req, res) {
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
  try {
    JWT.verify(token, process.env.JWT_PRIVATE_KEY);
    res.status(200)
      .json({
        message: 'LogoutSucceeded'
      });
  } catch (err) {
    const errorType = err.name;
    console.log(errorType);
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
  }
}

function signUp(req, res) {
  res.json({ yippee: 'You want to sign up? Fantastic!' });
}

function updateUserProfile(req, res) {
  res.json({ yippee: 'What\'s new, dear user?' });
}

function deleteUser(req, res) {
  res.json({ yippee: 'Awww... We are sorry to see you go...' });
}

/* Four use cases:
GET /users/ - Find matching instances of user.
GET /users/?limit={integer}&offset={integer} - Pagination for users.
GET /users/<id> - Find user.
GET /users/<id>/documents - Find all documents belonging to the user.*/
function findUsers(req, res) {
  res.json({ yippee: 'You want to know who else uses this app, no?' });
}

users.post('/login', login);
users.post('/logout', logout);
users.post('/', signUp);
users.put('/', updateUserProfile);
users.delete('/', deleteUser);
users.get('/', findUsers);

export default users;
