import request from 'superagent';
import {
  SIGN_UP_PENDING,
  SIGN_UP_REJECTED,
  SIGN_UP_FULFILLED,
  LOGIN_PENDING,
  LOGIN_REJECTED,
  LOGIN_FULFILLED,
  LOGOUT_PENDING,
  LOGOUT_FULFILLED,
  FETCH_ALL_USERS_PENDING,
  FETCH_ALL_USERS_REJECTED,
  FETCH_ALL_USERS_FULFILLED,
  UPDATE_USER_PENDING,
  UPDATE_USER_REJECTED,
  UPDATE_USER_FULFILLED,
  DELETE_USER_PENDING,
  DELETE_USER_REJECTED,
  DELETE_USER_FULFILLED
} from '../constants';

/**
 * login - Starts the login process.
 * @param {String} username - The username of the user trying to log in.
 * @param {String} password - The password of the user trying to log in.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the login process (commencement, success or failure).
 */
export function login(username, password) {
  return (dispatch) => {
    dispatch({ type: LOGIN_PENDING });
    request
      .post('/api/users/login')
      .send({ username, password })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch({
            type: LOGIN_REJECTED,
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: LOGIN_FULFILLED,
          payload: res.body
        });
      });
  };
}

/**
 * login - Starts the log out process.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the log out process (commencement, success or failure).
 */
export function logout() {
  return (dispatch) => {
    dispatch({
      type: LOGOUT_PENDING
    });

    // TODO: Send a request to /api/users/logout?
    dispatch({
      type: LOGOUT_FULFILLED,
      payload: {
        message: 'You\'re now logged out.'
      }
    });
  };
}

/**
 * signUp - Starts the sign up process.
 * @param {String} firstName - The first name of the user trying to sign up.
 * @param {String} lastName - The last name of the user trying to sign up.
 * @param {String} username - The username of the user trying to sign up.
 * @param {String} password - The password of the user trying to sign up.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the sign up process (commencement, success or failure).
 */
export function signUp(firstName, lastName, username, password) {
  return (dispatch) => {
    dispatch({ type: SIGN_UP_PENDING });
    request
      .post('/api/users/')
      .send({ firstName, lastName, username, password })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch({
            type: SIGN_UP_REJECTED,
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: SIGN_UP_FULFILLED,
          payload: res.body
        });
      });
  };
}

/**
 * fetchAllUsers - Fetches a list of all users.
 * @param {String} token - A token for the user making the request.
 * @param {String} limit - Number of users to return per request.
 * @param {String} offset - Number of users to skip before
 * beginning the fetch.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the fetching process (commencement, success or failure).
 */
export function fetchAllUsers(token, limit, offset) {
  return (dispatch) => {
    dispatch({
      type: FETCH_ALL_USERS_PENDING
    });

    request.get(`/api/users?limit=${limit}&offset=${offset}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: FETCH_ALL_USERS_REJECTED,
            payload: err.response.body
          });
          return;
        }

        dispatch({
          type: FETCH_ALL_USERS_FULFILLED,
          payload: res.body
        });
      });
  };
}

/**
 * updateUser - Updates a user's profile.
 * @param {String} token - A token for the user making the request.
 * @param {Number} targetUserId - Id of the user to update.
 * @param {Object} updateInfo - Data about the update e.g new username etc.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the update process (commencement, success or failure).
 */
export function updateUser(token, targetUserId, updateInfo) {
  return (dispatch) => {
    dispatch({ type: UPDATE_USER_PENDING });

    request.put(`/api/users/${targetUserId}`)
      .send(updateInfo)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: UPDATE_USER_REJECTED,
            payload: err.response.body
          });
          return;
        }

        dispatch({
          type: UPDATE_USER_FULFILLED,
          payload: res.body
        });
      });
  };
}

/**
 * deleteUser - Deletes a user.
 * @param {String} token - A token for the user making the request.
 * @param {Number} targetUserId - Id of the user to delete.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the deletion process (commencement, success or failure).
 */
export function deleteUser(token, targetUserId) {
  return (dispatch) => {
    dispatch({ type: DELETE_USER_PENDING });

    request.delete(`/api/users/${targetUserId}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: DELETE_USER_REJECTED,
            payload: err.response.body
          });
          return;
        }

        dispatch({
          type: DELETE_USER_FULFILLED,
          payload: res.body
        });
      });
  };
}
