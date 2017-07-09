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
  UPDATE_DOCUMENT_FULFILLED,

  LOGOUT_PENDING
} from '../constants';

/**
 * Creates a new state that has info about an Action this reducer received.
 * @param {Object} state - the previous state of the store.
 * @param {Object} action - the Action that happened and which needs to
 * be used to update the store.
 * @return {Object} - Returns a new state.
 */
export default function documentsReducer(state, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case LOGOUT_PENDING:
      newState.userDocumentsCount = 0;
      newState.userDocuments = [];
      newState.allDocumentsCount = 0;
      newState.allDocuments = [];
      break;

    case FETCH_USER_DOCUMENTS_PENDING:
      newState.status = 'fetchingUserDocuments';
      newState.statusMessage = 'Loading documents... Please wait...';
      break;

    case FETCH_ALL_DOCUMENTS_PENDING:
      newState.status = 'fetchingAllDocuments';
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
      newState.userDocumentsCount =
        state.userDocumentsCount + action.payload.documents.length;
      newState.userDocuments =
        action.payload.documents.concat(state.userDocuments);
      newState.status = 'documentCreated';
      newState.statusMessage = action.payload.message;
      break;

    case FETCH_USER_DOCUMENTS_FULFILLED:
      newState.userDocumentsCount =
        state.userDocumentsCount + action.payload.documents.length;
      newState.userDocuments =
        state.userDocuments.concat(action.payload.documents);
      newState.status = 'userDocumentsFetched';
      newState.statusMessage = action.payload.message;
      break;

    case FETCH_ALL_DOCUMENTS_FULFILLED:
      newState.allDocumentsCount =
        state.allDocumentsCount + action.payload.documents.length;
      newState.allDocuments =
        state.allDocuments.concat(action.payload.documents);
      newState.status = 'allDocumentsFetched';
      newState.statusMessage = action.payload.message;
      break;

    case FETCH_USER_DOCUMENTS_REJECTED:
      newState.status = 'fetchUserDocumentsFailed';
      newState.statusMessage = action.payload.message;
      break;

    case FETCH_ALL_DOCUMENTS_REJECTED:
      newState.status = 'fetchAllDocumentsFailed';
      newState.statusMessage = action.payload.message;
      break;

    case DELETE_DOCUMENT_PENDING:
      newState.status = 'deletingDocument';
      newState.statusMessage = 'Deleting document... Please wait...';
      newState.targetDocumentId = action.payload.targetDocumentId;
      break;

    case DELETE_DOCUMENT_REJECTED:
      newState.status = 'deleteDocumentFailed';
      newState.statusMessage = action.payload.message;
      newState.targetDocumentId = -1;
      break;

    case DELETE_DOCUMENT_FULFILLED:
      newState.status = 'documentDeleted';
      newState.statusMessage = action.payload.message;
      newState.userDocuments = state.userDocuments.filter(doc =>
        doc.id !== action.payload.targetDocumentId
      );
      newState.userDocumentsCount = newState.userDocuments.length;
      newState.targetDocumentId = -1;
      break;

    case UPDATE_DOCUMENT_PENDING:
      newState.status = 'updatingDocument';
      newState.statusMessage = 'Updating document... Please wait...';
      newState.targetDocumentId = action.payload.targetDocumentId;
      break;

    case UPDATE_DOCUMENT_REJECTED:
      newState.status = 'updateDocumentFailed';
      newState.statusMessage = action.payload.message;
      newState.targetDocumentId = -1;
      break;

    case UPDATE_DOCUMENT_FULFILLED:
      newState.status = 'documentUpdated';
      newState.statusMessage = action.payload.message;
      newState.userDocuments = state.userDocuments.map((doc) => {
        if (doc.id === action.payload.documents[0].id) {
          return action.payload.documents[0];
        }
        return doc;
      });
      newState.userDocumentsCount = newState.userDocuments.length;
      newState.targetDocumentId = -1;
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
      newState.userDocuments = [];
      newState.userDocumentsCount = 0;
      newState.allDocumentsCount = 0;
      newState.allDocuments = [];
      return newState;
    }
  }

  return newState;
}
