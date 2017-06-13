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
