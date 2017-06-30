import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const middleware = applyMiddleware(thunk);

const token = window.localStorage.getItem('token');
const userString = window.localStorage.getItem('user');
let isLoggedIn = false;
const isLoggingIn = false;
const isLoggingOut = false;
let user = {};
if (token) {
  isLoggedIn = true;
  user = JSON.parse(userString);
}

const store = createStore(
  reducers,
  {
    user: {
      isLoggedIn,
      isLoggingIn,
      isLoggingOut,
      token,
      user,
      signUpError: '',
      loginError: ''
    },
    documents: {
      count: 0,
      documents: [],
      status: 'fetchingDocuments',
      statusMessage: 'Loading documents... Please wait...',
      targetDocument: ''
    }
  },
  middleware
);

export default store;
