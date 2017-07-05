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
  FETCH_ALL_USERS_FULFILLED,
  UPDATE_USER_PENDING,
  UPDATE_USER_REJECTED,
  UPDATE_USER_FULFILLED,
  DELETE_USER_PENDING,
  DELETE_USER_REJECTED,
  DELETE_USER_FULFILLED
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
      newState.statusMessage = action.payload.users.length > 0 ? 'Successfully fetched users.' : 'Oops! There are no users yet.';
      newState.allUsers = state.allUsers.concat(action.payload.users);
      break;

    case UPDATE_USER_PENDING:
      newState.status = 'updatingUser';
      newState.statusMessage = 'Updating profile... Please wait...';
      break;

    case UPDATE_USER_REJECTED:
      newState.status = 'updateUserFailed';
      newState.statusMessage = action.payload.message || 'Failed to update this profile. Please try again.';
      break;

    case UPDATE_USER_FULFILLED:
      newState.status = 'updatedUser';
      newState.statusMessage = 'Account successfully updated.';
      newState.allUsers = state.allUsers.map((user) => {
        const updatedUser = action.payload.users[0];
        if (user.id === updatedUser.id) {
          return updatedUser;
        }

        return user;
      });
      break;

    case DELETE_USER_PENDING:
      newState.status = 'deletingUser';
      newState.statusMessage = 'Deleting account... Please wait...';
      break;

    case DELETE_USER_REJECTED:
      newState.status = 'deleteUserFailed';
      newState.statusMessage = action.payload.message || 'Failed to delete account. Please try again.';
      break;

    case DELETE_USER_FULFILLED:
      newState.status = 'deletedUser';
      newState.statusMessage = action.payload.message || 'Account successfully deleted.';
      newState.allUsers = state.allUsers.filter(user =>
        user.username !== action.payload.users[0].username
      );
      newState.deletedUserId = action.payload.users[0].id;
      break;

    default:
      break;
  }

  return newState;
}
