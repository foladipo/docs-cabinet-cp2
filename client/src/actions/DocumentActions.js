import request from 'superagent';
import {
  FETCH_ALL_DOCUMENTS_PENDING,
  FETCH_ALL_DOCUMENTS_REJECTED,
  FETCH_ALL_DOCUMENTS_FULFILLED,
  FETCH_USER_DOCUMENTS_PENDING,
  FETCH_USER_DOCUMENTS_REJECTED,
  FETCH_USER_DOCUMENTS_FULFILLED,
  CREATE_DOCUMENT_PENDING,
  CREATE_DOCUMENT_REJECTED,
  CREATE_DOCUMENT_FULFILLED,
  DELETE_DOCUMENT_PENDING,
  DELETE_DOCUMENT_REJECTED,
  DELETE_DOCUMENT_FULFILLED,
  UPDATE_DOCUMENT_PENDING,
  UPDATE_DOCUMENT_REJECTED,
  UPDATE_DOCUMENT_FULFILLED
} from '../constants';

/**
 * createDocument - Creates a new document.
 * @param {String} token - A token for this document's author.
 * @param {String} title - The title of the new document.
 * @param {String} content - The content of the new document.
 * @param {String} access - The access type of the new document.
 * @param {String} categories - The categories of the new document.
 * @param {String} tags - The tags of the new document.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the document creation process (commencement, success
 * or failure).
 */
export function createDocument(token, title, content, access, categories,
  tags) {
  return (dispatch) => {
    dispatch({ type: CREATE_DOCUMENT_PENDING });
    const newDocument = {
      title,
      content,
      access,
      categories,
      tags
    };

    request
      .post('/api/documents')
      .send(newDocument)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: CREATE_DOCUMENT_REJECTED,
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: CREATE_DOCUMENT_FULFILLED,
          payload: res.body
        });
      });
  };
}

/**
 * fetchAllDocuments - Fetches all documents.
 * @param {String} token - A token for the user making the request.
 * @param {String} limit - Number of documents to return per request.
 * @param {String} offset - Number of documents to skip before
 * beginning the fetch.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the document fetching process (commencement, success
 * or failure).
 */
export function fetchAllDocuments(token, limit, offset) {
  return (dispatch) => {
    dispatch({ type: FETCH_ALL_DOCUMENTS_PENDING });

    request
      .get(`/api/documents?limit=${limit}&offset=${offset}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: FETCH_ALL_DOCUMENTS_REJECTED,
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: FETCH_ALL_DOCUMENTS_FULFILLED,
          payload: res.body
        });
      });
  };
}

/**
 * fetchUserDocuments - Fetches the documents that belong to a user.
 * @param {String} token - A token for the user making the request.
 * @param {Number} id - The id of the user making the request.
 * @param {String} limit - Number of documents to return per request.
 * @param {String} offset - Number of documents to skip before
 * beginning the fetch.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the document fetching process (commencement, success
 * or failure).
 */
export function fetchUserDocuments(token, id, limit, offset) {
  return (dispatch) => {
    dispatch({ type: FETCH_USER_DOCUMENTS_PENDING });

    request
      .get(`/api/users/${id}/documents?limit=${limit}&offset=${offset}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: FETCH_USER_DOCUMENTS_REJECTED,
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: FETCH_USER_DOCUMENTS_FULFILLED,
          payload: res.body
        });
      });
  };
}

/**
 * deleteDocument - Deletes a document.
 * @param {String} token - A token for the user making the request.
 * @param {String} documentId - The id of the document to be deleted.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the deletion process (commencement, success or failure).
 */
export function deleteDocument(token, documentId) {
  return (dispatch) => {
    dispatch({
      type: DELETE_DOCUMENT_PENDING,
      payload: {
        targetDocumentId: documentId
      }
    });

    request
      .delete(`/api/documents/${documentId}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: DELETE_DOCUMENT_REJECTED,
            payload: {
              error: err.response.body.error,
              targetDocumentId: documentId
            }
          });
          return;
        }
        dispatch({
          type: DELETE_DOCUMENT_FULFILLED,
          payload: {
            response: res.body,
            targetDocumentId: documentId
          }
        });
      });
  };
}

/**
 * updateDocument - Updates document.
 * @param {String} token - A token for this document's author.
 * @param {Number} targetDocumentId - The id of the document to update.
 * @param {Object} updateInfo - Info about the fields of the document which
 * are to be updated.
 * @return {Function} - Returns a function that dispatches actions based
 * on the state of the document creation process (commencement, success
 * or failure).
 */
export function updateDocument(token, targetDocumentId, updateInfo) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_DOCUMENT_PENDING,
      payload: {
        targetDocumentId
      }
    });

    request
      .put(`/api/documents/${targetDocumentId}`)
      .send(updateInfo)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', token)
      .end((err, res) => {
        if (err) {
          dispatch({
            type: UPDATE_DOCUMENT_REJECTED,
            payload: { error: err.response.body.error }
          });
          return;
        }
        dispatch({
          type: UPDATE_DOCUMENT_FULFILLED,
          payload: res.body
        });
      });
  };
}
