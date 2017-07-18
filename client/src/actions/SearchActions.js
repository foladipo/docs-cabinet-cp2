import superagent from 'superagent';
import { ActionTypes } from '../constants/';


/**
 * searchUsers - Searches for users.
 * @param {String} token - A token for the user making the request.
 * @param {String} query - The query to use for the search.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the search process (commencement, success or failure).
 */
export function searchUsers(token, query) {
  return (dispatch, getState, httpClient) => {
    dispatch({ type: ActionTypes.SEARCH_USERS_PENDING });

    const request = httpClient || superagent;

    request.get(`/api/search/users?q=${query}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: ActionTypes.SEARCH_USERS_REJECTED,
            payload: err.response.body
          });
          return;
        }

        dispatch({
          type: ActionTypes.SEARCH_USERS_FULFILLED,
          payload: {
            query,
            ...res.body
          }
        });
      });
  };
}

/**
 * searchDocuments - Searches for documents.
 * @param {String} token - A token for the user making the request.
 * @param {String} query - The query to use for the search.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the search process (commencement, success or failure).
 */
export function searchDocuments(token, query) {
  return (dispatch, getState, httpClient) => {
    dispatch({ type: ActionTypes.SEARCH_DOCUMENTS_PENDING });

    const request = httpClient || superagent;

    request.get(`/api/search/documents?q=${query}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: ActionTypes.SEARCH_DOCUMENTS_REJECTED,
            payload: err.response.body
          });
          return;
        }

        dispatch({
          type: ActionTypes.SEARCH_DOCUMENTS_FULFILLED,
          payload: {
            query,
            ...res.body
          }
        });
      });
  };
}
