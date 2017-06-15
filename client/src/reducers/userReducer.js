export default function userReducer(state, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case 'LOGIN_PENDING':
      newState.isLoggingIn = true;
      newState.isLoggedIn = false;
      break;

    case 'LOGIN_FULFILLED':
      newState.isLoggingIn = false;
      newState.isLoggedIn = true;
      newState.token = action.payload.token;
      newState.user = action.payload.user;
      newState.error = '';
      window.localStorage.setItem('token', action.payload.token);
      window.localStorage.setItem('user', JSON.stringify(action.payload.user));
      window.location.replace('/dashboard');
      break;

    case 'LOGIN_REJECTED':
      newState.isLoggingIn = false;
      newState.isLoggedIn = false;
      newState.error = action.payload.error;
      break;

    case 'LOG_OUT_PENDING':
      newState.isLoggingOut = true;
      newState.isLoggedIn = false;
      newState.token = null;
      newState.user = {};
      window.localStorage.clear();
      break;

    // TODO: Maybe split these cases? E.g show an error for the rejection.
    case 'LOG_OUT_REJECTED':
    case 'LOG_OUT_SUCCESS':
      window.location.replace('/');
      break;

    default:
      break;
  }

  return newState;
}
