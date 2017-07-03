import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import RootComponent from './components/RootComponent';

// Styles for the rendered document.
// eslint-disable-next-line no-unused-vars
import mainStyles from './scss/style.scss';

ReactDOM.render(
  <Provider store={store}>
    <RootComponent />
  </Provider>,
  document.getElementById('root-component')
);
