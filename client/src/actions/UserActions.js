import request from 'superagent';

/**
 * login - Starts the login process.
 * @param {String} username - The username of the user trying to log in.
 * @param {String} password - The password of the user trying to log in.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the login process (commencement, success or failure).
 */
export function login(username, password) {
  return (dispatch) => {
    dispatch({ type: 'LOGIN_PENDING' });
    request
      .post('/api/users/login')
      .send({ username, password })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch({
            type: 'LOGIN_REJECTED',
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: 'LOGIN_FULFILLED',
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
      type: 'LOGOUT_PENDING'
    });

    // TODO: Send a request to /api/users/logout?
    dispatch({
      type: 'LOGOUT_SUCCESS'
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
    dispatch({ type: 'SIGN_UP_PENDING' });
    request
      .post('/api/users/')
      .send({ firstName, lastName, username, password })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          dispatch({
            type: 'SIGN_UP_REJECTED',
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: 'SIGN_UP_FULFILLED',
          payload: res.body
        });
      });
  };
}
