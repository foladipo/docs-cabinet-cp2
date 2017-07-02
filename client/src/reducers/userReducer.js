import {
  SIGN_UP_PENDING,
  SIGN_UP_REJECTED,
  SIGN_UP_FULFILLED,
  LOGIN_PENDING,
  LOGIN_REJECTED,
  LOGIN_FULFILLED,
  LOGOUT_PENDING,
  LOGOUT_REJECTED,
  LOGOUT_FULFILLED,
  FETCH_ALL_USERS_PENDING,
  FETCH_ALL_USERS_REJECTED,
  FETCH_ALL_USERS_FULFILLED
} from '../constants';

/**
 * Creates a new state that has info about an Action this reducer received.
 * @param {state} state - the previous state of the store.
 * @param {Object} action - the Action that happened and which needs to
 * be used to update the store.
 * @return {Object} - Returns a new state.
 */
export default function userReducer(state, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case SIGN_UP_PENDING:
    case LOGIN_PENDING:
      newState.isLoggingIn = true;
      newState.isLoggedIn = false;
      break;

    case SIGN_UP_FULFILLED:
    case LOGIN_FULFILLED:
      newState.isLoggingIn = false;
      newState.isLoggedIn = true;
      newState.token = action.payload.token;
      newState.user = action.payload.user;
      newState.signUpError = '';
      newState.loginError = '';
      window.localStorage.setItem('token', action.payload.token);
      window.localStorage.setItem('user', JSON.stringify(action.payload.user));
      break;

    case SIGN_UP_REJECTED:
      newState.isLoggingIn = false;
      newState.isLoggedIn = false;
      newState.signUpError = action.payload.error;
      break;

    case LOGIN_REJECTED:
      newState.isLoggingIn = false;
      newState.isLoggedIn = false;
      newState.loginError = action.payload.error;
      break;

    case LOGOUT_PENDING:
      newState.isLoggingOut = true;
      newState.isLoggedIn = false;
      newState.token = null;
      newState.user = null;
      window.localStorage.clear();
      break;

     // TODO: Maybe split these cases? E.g show an error for the rejection.
    case LOGOUT_REJECTED:
    case LOGOUT_FULFILLED:
      newState.isLoggingOut = false;
      break;

    case FETCH_ALL_USERS_PENDING:
      newState.status = 'fetchingAllUsers';
      newState.statusMessage = 'Fetching users... Please wait...';
      break;

    case FETCH_ALL_USERS_REJECTED:
      newState.status = 'fetchAllUsersFailed';
      newState.statusMessage = action.payload.message || 'Failed to fetch users. Please try again.';
      break;

    case FETCH_ALL_USERS_FULFILLED:
      newState.status = 'fetchedAllUsers';
      newState.statusMessage = 'Successfully fetched users.';
      newState.allUsers = state.allUsers.concat(action.payload.users);
      break;

    default:
      break;
  }

  return newState;
}
