import {
  FETCH_DOCUMENTS_PENDING,
  FETCH_DOCUMENTS_REJECTED,
  FETCH_DOCUMENTS_FULFILLED,
  FETCH_USER_DOCUMENTS_PENDING,
  FETCH_USER_DOCUMENTS_REJECTED,
  FETCH_USER_DOCUMENTS_FULFILLED,
  CREATE_DOCUMENT_PENDING,
  CREATE_DOCUMENT_REJECTED,
  CREATE_DOCUMENT_FULFILLED,
  DELETE_DOCUMENT_PENDING,
  DELETE_DOCUMENT_REJECTED,
  DELETE_DOCUMENT_FULFILLED,

  LOGOUT_PENDING
} from '../constants';

/**
 * Creates a new state that has info about an Action this reducer received.
 * @param {state} state - the previous state of the store.
 * @param {Object} action - the Action that happened and which needs to
 * be used to update the store.
 * @return {Object} - Returns a new state.
 */
export default function documentsReducer(state, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case LOGOUT_PENDING:
      newState.documents = [];
      newState.count = 0;
      break;

    case FETCH_USER_DOCUMENTS_PENDING:
    case FETCH_DOCUMENTS_PENDING:
      newState.status = 'fetchingDocuments';
      newState.statusMessage = 'Loading documents... Please wait...';
      break;

    case CREATE_DOCUMENT_PENDING:
      newState.status = 'creatingDocument';
      newState.statusMessage = 'Creating document... Please wait...';
      break;

    case CREATE_DOCUMENT_REJECTED:
      newState.status = 'documentCreationFailed';
      newState.statusMessage = action.payload.message;
      break;

    case CREATE_DOCUMENT_FULFILLED:
      newState.count = state.count + action.payload.documents.length;
      newState.documents = action.payload.documents.concat(state.documents);
      newState.status = 'documentCreated';
      newState.statusMessage = action.payload.message;
      break;

    case FETCH_USER_DOCUMENTS_FULFILLED:
    case FETCH_DOCUMENTS_FULFILLED:
      newState.count = state.count + action.payload.documents.length;
      newState.documents = state.documents.concat(action.payload.documents);
      newState.status = 'documentsFetched';
      newState.statusMessage = action.payload.message;
      break;

    case FETCH_USER_DOCUMENTS_REJECTED:
    case FETCH_DOCUMENTS_REJECTED:
      newState.status = 'documentsFetchFailed';
      newState.statusMessage = action.payload.message;
      break;

    case DELETE_DOCUMENT_PENDING:
      newState.status = 'deletingDocument';
      newState.statusMessage = 'Deleting document... Please wait...';
      newState.targetDocument = action.payload.targetDocument;
      break;

    case DELETE_DOCUMENT_REJECTED:
      newState.status = 'deleteDocumentFailed';
      newState.statusMessage = action.payload.message;
      newState.targetDocument = '';
      break;

    case DELETE_DOCUMENT_FULFILLED:
      newState.status = 'documentDeleted';
      newState.statusMessage = action.payload.message;
      newState.documents = state.documents.filter(doc =>
        doc.id !== action.payload.targetDocument
      );
      newState.count = newState.documents.length;
      newState.targetDocument = '';
      break;

    default:
      break;
  }

  if (action.payload !== undefined) {
    if (
      action.payload.error === 'ExpiredTokenError' ||
      action.payload.error === 'InvalidTokenError'
    ) {
      window.localStorage.clear();
      newState.documents = [];
      newState.count = 0;
      return newState;
    }
  }

  return newState;
}
