import request from 'superagent';
import axios from 'axios';

export function login(username, password) {
  return function(dispatch) {
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
  return function(dispatch) {
    dispatch({
      type: 'LOG_OUT_PENDING'
    });

    // TODO: Send a request to /api/users/logout.
    dispatch({
      type: 'LOG_OUT_SUCCESS'
    });
  };
}
