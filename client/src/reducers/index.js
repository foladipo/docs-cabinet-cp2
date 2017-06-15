import { combineReducers } from 'redux';
import documentsReducer from './documentsReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
  user: userReducer,
  documents: documentsReducer
});

export default reducers;
