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
    case 'FETCH_DOCUMENTS_SUCCESS':
      newState.count = action.payload.documents.length;
      newState.documents = action.payload.documents;
      break;

    default:
      break;
  }
  return newState;
}
