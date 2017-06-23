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
    case 'SIGN_UP_PENDING':
    case 'LOGIN_PENDING':
      newState.isLoggingIn = true;
      newState.isLoggedIn = false;
      break;

    case 'SIGN_UP_FULFILLED':
    case 'LOGIN_FULFILLED':
      newState.isLoggingIn = false;
      newState.isLoggedIn = true;
      newState.token = action.payload.token;
      newState.user = action.payload.user;
      newState.signUpError = '';
      newState.loginError = '';
      window.localStorage.setItem('token', action.payload.token);
      window.localStorage.setItem('user', JSON.stringify(action.payload.user));
      window.location.replace('/dashboard');
      break;

    case 'SIGN_UP_REJECTED':
      newState.isLoggingIn = false;
      newState.isLoggedIn = false;
      newState.signUpError = action.payload.error;
      break;

    case 'LOGIN_REJECTED':
      newState.isLoggingIn = false;
      newState.isLoggedIn = false;
      newState.loginError = action.payload.error;
      break;

    case 'LOGOUT_PENDING':
      newState.isLoggingOut = true;
      newState.isLoggedIn = false;
      newState.token = null;
      newState.user = null;
      window.localStorage.clear();
      break;

     // TODO: Maybe split these cases? E.g show an error for the rejection.
    case 'LOGOUT_REJECTED':
    case 'LOGOUT_SUCCESS':
      newState.isLoggingOut = false;
      window.location.replace('/');
      break;

    default:
      break;
  }

  return newState;
}
