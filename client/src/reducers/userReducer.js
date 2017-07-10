import {
  SIGN_UP_PENDING,
  SIGN_UP_REJECTED,
  SIGN_UP_FULFILLED,
  LOGIN_PENDING,
  LOGIN_REJECTED,
  LOGIN_FULFILLED,
  LOGOUT_PENDING,
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
 * @param {Object} state - the previous state of the store.
 * @param {Object} action - the Action that happened and which needs to
 * be used to update the store.
 * @return {Object} - Returns a new state.
 */
export default function userReducer(state, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case SIGN_UP_PENDING:
      newState.status = 'signingUp';
      newState.statusMessage = 'Creating your account... Please wait...';
      newState.isLoggingIn = true;
      newState.isLoggedIn = false;
      break;

    case SIGN_UP_REJECTED:
      newState.status = 'signUpFailed';
      newState.statusMessage = action.payload.message || 'Failed to sign up. Please try again.';
      newState.isLoggingIn = false;
      newState.isLoggedIn = false;
      break;

    case SIGN_UP_FULFILLED:
      newState.status = 'signedUp';
      newState.statusMessage = action.payload.message;
      newState.isLoggingIn = false;
      newState.isLoggedIn = true;
      newState.token = action.payload.token;
      newState.user = action.payload.user;
      window.localStorage.setItem('token', action.payload.token);
      window.localStorage.setItem('user', JSON.stringify(action.payload.user));
      break;

    case LOGIN_PENDING:
      newState.status = 'loggingIn';
      newState.statusMessage = 'Logging in... Please wait...';
      newState.isLoggingIn = true;
      newState.isLoggedIn = false;
      break;

    case LOGIN_REJECTED:
      newState.status = 'loginFailed';
      newState.statusMessage = action.payload.message ||
        'Failed to login. Please try again.';
      newState.isLoggingIn = false;
      newState.isLoggedIn = false;
      break;

    case LOGIN_FULFILLED:
      newState.status = 'loggedIn';
      newState.statusMessage = action.payload.message;
      newState.isLoggingIn = false;
      newState.isLoggedIn = true;
      newState.token = action.payload.token;
      newState.user = action.payload.user;
      window.localStorage.setItem('token', action.payload.token);
      window.localStorage.setItem('user', JSON.stringify(action.payload.user));
      break;

    case LOGOUT_PENDING:
      newState.status = 'loggingOut';
      newState.statusMessage = 'Logging out... Please wait...';
      newState.isLoggingOut = true;
      newState.isLoggedIn = false;
      newState.token = null;
      newState.user = null;
      window.localStorage.clear();
      break;

    case LOGOUT_FULFILLED:
      newState.status = 'loggedOut';
      newState.statusMessage = action.payload.message;
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
      if (action.payload.users.length > 0) {
        newState.statusMessage = 'Successfully fetched users.';
      } else {
        if (state.allUsers.length > 0) {
          newState.statusMessage = 'Oops! There are no users left.';
        } else {
          newState.statusMessage = 'There are no users yet.';
        }
      }
      newState.allUsers = state.allUsers.concat(action.payload.users);
      break;

    case UPDATE_USER_PENDING:
      newState.status = 'updatingUser';
      newState.statusMessage = 'Updating profile... Please wait...';
      break;

    case UPDATE_USER_REJECTED:
      newState.status = 'updateUserFailed';
      newState.statusMessage = action.payload.message ||
        'Failed to update this profile. Please try again.';
      break;

    // TODO: Update state.token etc when a user updates his/her own profile.
    case UPDATE_USER_FULFILLED:
      newState.status = 'updatedUser';
      newState.statusMessage = action.payload.message;
      newState.allUsers = state.allUsers.map((user) => {
        const updatedUser = action.payload.users[0];
        if (user.id === updatedUser.id) {
          return updatedUser;
        }

        return user;
      });
      if (action.payload.users[0] === state.user.id) {
        newState.user = action.payload.users[0];
      }
      break;

    case DELETE_USER_PENDING:
      newState.status = 'deletingUser';
      newState.statusMessage = 'Deleting account... Please wait...';
      break;

    case DELETE_USER_REJECTED:
      newState.status = 'userDeletionFailed';
      newState.statusMessage = action.payload.message || 'Failed to delete account. Please try again.';
      break;

    case DELETE_USER_FULFILLED:
      newState.status = 'deletedUser';
      newState.statusMessage = action.payload.message;
      newState.allUsers = state.allUsers.filter(user =>
        user.username !== action.payload.users[0].username
      );
      newState.deletedUserId = action.payload.users[0].id;
      if (action.payload.users[0].id === state.user.id) {
        newState.isLoggedIn = false;
        newState.isLoggingIn = false;
        newState.isLoggingOut = false;
        newState.token = null;
        newState.user = null;
        window.localStorage.clear();
      }
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
      newState.isLoggedIn = false;
      newState.isLoggingIn = false;
      newState.isLoggingOut = false;
    }
  }

  return newState;
}
