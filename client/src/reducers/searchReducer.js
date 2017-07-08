import {
  SEARCH_USERS_PENDING,
  SEARCH_USERS_REJECTED,
  SEARCH_USERS_FULFILLED
} from '../constants/';

/**
 * Creates a new state that has info about an Action this reducer received.
 * @param {Object} state - the previous state of the store.
 * @param {Object} action - the Action that happened and which needs to
 * be used to update the store.
 * @return {Object} - Returns a new state.
 */
export default function searchReducer(state, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case SEARCH_USERS_PENDING:
      newState.status = 'searchingUsers';
      newState.statusMessage = 'Searching... Please wait...';
      break;

    case SEARCH_USERS_REJECTED:
      newState.status = 'searchUsersFailed';
      newState.statusMessage = action.payload.message || 'Search failed. Please try again.';
      break;

    case SEARCH_USERS_FULFILLED:
      newState.status = 'searchedUsers';
      newState.statusMessage = action.payload.message || 'Search completed.';
      newState.users = {
        lastSearchQuery: action.query,
        lastSearchResultsCount: action.payload.users.length,
        lastSearchResults: action.payload.users
      };
      break;

    default:
      break;
  }

  if (action.payload !== undefined) {
    if (action.payload.error === 'ExpiredTokenError' ||
      action.payload.error === 'InvalidTokenError') {
      if (action.payload.error === 'ExpiredTokenError') {
        newState.status = 'expiredToken';
      }
      if (action.payload.error === 'InvalidTokenError') {
        newState.status = 'invalidToken';
      }
      window.localStorage.clear();
      newState.users = {
        lastSearchQuery: '',
        lastSearchResultsCount: 0,
        lastSearchResults: []
      };
    }
  }

  return newState;
}