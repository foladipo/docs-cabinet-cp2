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
  GET_DOCUMENT_PENDING,
  GET_DOCUMENT_REJECTED,
  GET_DOCUMENT_FULFILLED,

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
      newState.userDocuments = {
        documents: [],
        page: 0,
        pageSize: 0,
        pageCount: 0,
        totalCount: 0
      };
      newState.allDocumentsCount = 0;
      newState.allDocuments = {
        documents: [],
        page: 0,
        pageSize: 0,
        pageCount: 0,
        totalCount: 0
      };
      break;

    case FETCH_ALL_DOCUMENTS_PENDING:
      newState.status = 'fetchingAllDocuments';
      newState.statusMessage = 'Loading documents... Please wait...';
      break;

    case FETCH_ALL_DOCUMENTS_REJECTED:
      newState.status = 'fetchAllDocumentsFailed';
      newState.statusMessage = action.payload.message ||
        'Failed to load documents. Please try again.';
      break;

    case FETCH_ALL_DOCUMENTS_FULFILLED:
      newState.status = 'allDocumentsFetched';
      newState.statusMessage = action.payload.message;
      newState.allDocumentsCount =
        state.allDocumentsCount + action.payload.documents.length;
      newState.allDocuments.page = action.payload.page;
      newState.allDocuments.pageSize = action.payload.pageSize;
      newState.allDocuments.pageCount = action.payload.pageCount;
      newState.allDocuments.totalCount = action.payload.totalCount;
      newState.allDocuments.documents =
        state.allDocuments.documents.concat(action.payload.documents);
      break;

    case FETCH_USER_DOCUMENTS_PENDING:
      newState.status = 'fetchingUserDocuments';
      newState.statusMessage = 'Loading documents... Please wait...';
      break;

    case FETCH_USER_DOCUMENTS_REJECTED:
      newState.status = 'fetchUserDocumentsFailed';
      newState.statusMessage = action.payload.message ||
        'Failed to load documents. Please try again.';
      break;

    case FETCH_USER_DOCUMENTS_FULFILLED:
      newState.status = 'userDocumentsFetched';
      newState.statusMessage = action.payload.message;
      newState.userDocumentsCount =
        state.userDocumentsCount + action.payload.documents.length;
      newState.userDocuments.page = action.payload.page;
      newState.userDocuments.pageSize = action.payload.pageSize;
      newState.userDocuments.pageCount = action.payload.pageCount;
      newState.userDocuments.totalCount = action.payload.totalCount;
      newState.userDocuments.documents =
        state.userDocuments.documents.concat(action.payload.documents);
      break;

    case CREATE_DOCUMENT_PENDING:
      newState.status = 'creatingDocument';
      newState.statusMessage = 'Creating document... Please wait...';
      break;

    case CREATE_DOCUMENT_REJECTED:
      newState.status = 'documentCreationFailed';
      newState.statusMessage = action.payload.message ||
        'Failed to create document. Please try again.';
      break;

    case CREATE_DOCUMENT_FULFILLED:
      newState.status = 'documentCreated';
      newState.statusMessage = action.payload.message;
      newState.userDocumentsCount =
        state.userDocumentsCount + action.payload.documents.length;
      newState.userDocuments.documents =
        action.payload.documents.concat(state.userDocuments.documents);
      break;

    case DELETE_DOCUMENT_PENDING:
      newState.status = 'deletingDocument';
      newState.statusMessage = 'Deleting document... Please wait...';
      newState.targetDocumentId = action.payload.targetDocumentId;
      break;

    case DELETE_DOCUMENT_REJECTED:
      newState.status = 'documentDeletionFailed';
      newState.statusMessage = action.payload.message ||
        'Failed to delete document. Please try again.';
      newState.targetDocumentId = -1;
      break;

    case DELETE_DOCUMENT_FULFILLED:
      newState.status = 'documentDeleted';
      newState.statusMessage = action.payload.message;
      newState.userDocuments.documents =
        state.userDocuments.documents.filter(doc =>
          doc.id !== action.payload.documents[0].id
        );
      newState.userDocumentsCount = newState.userDocuments.documents.length;
      newState.targetDocumentId = -1;
      break;

    case UPDATE_DOCUMENT_PENDING:
      newState.status = 'updatingDocument';
      newState.statusMessage = 'Updating document... Please wait...';
      newState.targetDocumentId = action.payload.targetDocumentId;
      break;

    case UPDATE_DOCUMENT_REJECTED:
      newState.status = 'documentUpdateFailed';
      newState.statusMessage = action.payload.message ||
        'Failed to update document. Please try again.';
      newState.targetDocumentId = -1;
      break;

    case UPDATE_DOCUMENT_FULFILLED:
      newState.status = 'documentUpdated';
      newState.statusMessage = action.payload.message;
      newState.userDocuments.documents =
        state.userDocuments.documents.map((doc) => {
          if (doc.id === action.payload.documents[0].id) {
            return action.payload.documents[0];
          }
          return doc;
        });
      newState.userDocumentsCount = newState.userDocuments.documents.length;
      newState.targetDocumentId = -1;
      break;

    case GET_DOCUMENT_PENDING:
      newState.status = 'gettingDocument';
      newState.statusMessage = 'Retrieving document... Please wait...';
      newState.documentToUpdate = {};
      break;

    case GET_DOCUMENT_REJECTED:
      newState.status = 'getDocumentFailed';
      newState.statusMessage =
        action.payload.message ||
        'Failed to retrieve document. Please try again.';
      break;

    case GET_DOCUMENT_FULFILLED:
      newState.status = 'gotDocument';
      newState.statusMessage = 'Successfully retrieved document.';
      newState.userToUpdate = action.payload.users[0];
      break;

    default:
      break;
  }

  if (action.payload !== undefined) {
    if (
      action.payload.error === 'ExpiredTokenError' ||
      action.payload.error === 'InvalidTokenError'
    ) {
      newState.userDocuments = {
        documents: [],
        page: 0,
        pageSize: 0,
        pageCount: 0,
        totalCount: 0
      };
      newState.userDocumentsCount = 0;
      newState.allDocumentsCount = 0;
      newState.allDocuments = {
        documents: [],
        page: 0,
        pageSize: 0,
        pageCount: 0,
        totalCount: 0
      };
      return newState;
    }
  }

  return newState;
}
