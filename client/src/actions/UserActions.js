import request from 'superagent';

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

export function logout() {
  return (dispatch) => {
    dispatch({
      type: 'LOG_OUT_PENDING'
    });

    // TODO: Send a request to /api/users/logout.
    dispatch({
      type: 'LOG_OUT_SUCCESS'
    });
  };
}

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
