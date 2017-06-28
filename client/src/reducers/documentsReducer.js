// TODO: For any request that returns an InvalidTokenError, log the user out.
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
    case 'FETCH_USER_DOCUMENTS_PENDING':
    case 'FETCH_DOCUMENTS_PENDING':
      newState.status = 'fetchingDocuments';
      newState.statusMessage = 'Loading documents... Please wait...';
      break;

    case 'CREATE_DOCUMENT_FULFILLED':
      newState.count = state.count + action.payload.documents.length;
      newState.documents = action.payload.documents.concat(state.documents);
      newState.status = 'documentCreated';
      newState.statusMessage = 'Document created!';
      break;

    case 'FETCH_USER_DOCUMENTS_FULFILLED':
    case 'FETCH_DOCUMENTS_FULFILLED':
      newState.count = state.count + action.payload.documents.length;
      newState.documents = state.documents.concat(action.payload.documents);
      newState.status = 'documentsFetched';
      newState.statusMessage = 'Finished loading documents.';
      break;

    case 'FETCH_USER_DOCUMENTS_REJECTED':
    case 'FETCH_DOCUMENTS_REJECTED':
      if (action.payload.error === 'InvalidTokenError') {
        newState.status = 'invalidTokenError';
        newState.statusMessage = 'You\'re not logged in. Please log in again.';
        break;
      }
      newState.status = 'documentsFetchFailed';
      newState.statusMessage = 'Failed to load documents. Please try again.';
      break;

    default:
      break;
  }
  return newState;
}
