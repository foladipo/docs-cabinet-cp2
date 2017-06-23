import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const middleware = applyMiddleware(thunk);

const store = createStore(
  reducers,
  {
    user: {
      isLoggedIn: false,
      isLoggingIn: false,
      isLoggingOut: false,
      token: null,
      user: {},
      signUpError: '',
      loginError: ''
    },
    documents: {
      count: 0,
      documents: []
    }
  },
  middleware
);

export default store;
