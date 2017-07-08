import request from 'superagent';
import {
  SEARCH_USERS_PENDING,
  SEARCH_USERS_REJECTED,
  SEARCH_USERS_FULFILLED
} from '../constants/';


/**
 * searchUsers - Searches for users.
 * @param {String} token - A token for the user making the request.
 * @param {String} query - The query to use for the search.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the search process (commencement, success or failure).
 */
export default function searchUsers(token, query) {
  return (dispatch) => {
    dispatch({ type: SEARCH_USERS_PENDING });

    request.get(`/api/search/users?q=${query}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: SEARCH_USERS_REJECTED,
            payload: err.response.body
          });
          return;
        }

        dispatch({
          type: SEARCH_USERS_FULFILLED,
          payload: res.body,
          query
        });
      });
  };
}
