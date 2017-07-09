import { combineReducers } from 'redux';
import documentsReducer from './documentsReducer';
import searchReducer from './searchReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
  documents: documentsReducer,
  search: searchReducer,
  user: userReducer
});

export default reducers;
