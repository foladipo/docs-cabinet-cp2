import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import RootContainer from './components/RootContainer';

// Styles for the rendered document.
// eslint-disable-next-line no-unused-vars
import mainStyles from './scss/style.scss';

ReactDOM.render(
  <Provider store={store}>
    <RootContainer />
  </Provider>,
  document.getElementById('root-container')
);
