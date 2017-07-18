import chai from 'chai';
import _ from 'lodash';
import searchReducer from '../../reducers/searchReducer';
import { ActionTypes } from '../../constants';

const expect = chai.expect;

describe('searchReducer', () => {
  const getDefaultState = () => ({
    users: {
      lastSearchQuery: '',
      lastSearchResultsCount: 0,
      lastSearchResults: []
    },
    documents: {
      lastSearchQuery: '',
      lastSearchResultsCount: 0,
      lastSearchResults: []
    }
  });

  it('should be defined', () => {
    expect(searchReducer).to.not.equal(undefined);
  });

  it('should update the store when a search for users is started', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_USERS_PENDING
    };
    const newState = searchReducer(state, action);
    expect(newState.status).to.equal('searchingUsers');
    expect(newState.statusMessage).to.equal('Searching... Please wait...');
  });

  it('should update the store when a search for users fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_USERS_REJECTED,
      payload: {}
    };
    const newState = searchReducer(state, action);
    expect(newState.status).to.equal('searchUsersFailed');
    expect(newState.statusMessage).to.equal('Search failed. Please try again.');
  });

  it('should update the store when a search for users succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_USERS_FULFILLED,
      query: 'foobar',
      payload: {
        message: 'Users found.',
        users: [{ username: 'John Doe' }]
      }
    };
    const newState = searchReducer(state, action);
    expect(newState.status).to.equal('searchedUsers');
    expect(newState.statusMessage).to.equal('Users found.');
    expect(newState.users.query).to.equal(action.payload.query);
    expect(Array.isArray(newState.users.lastSearchResults)).to.equal(true);
    expect(newState.users.lastSearchResults.length === 1).to.equal(true);
  });

  it('should update the store when a search for documents is started', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_DOCUMENTS_PENDING
    };
    const newState = searchReducer(state, action);
    expect(newState.status).to.equal('searchingDocuments');
    expect(newState.statusMessage).to.equal('Searching... Please wait...');
  });

  it('should update the store when a search for documents fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_DOCUMENTS_REJECTED,
      payload: {}
    };
    const newState = searchReducer(state, action);
    expect(newState.status).to.equal('searchDocumentsFailed');
    expect(newState.statusMessage).to.equal('Search failed. Please try again.');
  });

  it('should NOT update the store for unknown action types', () => {
    const state = getDefaultState();
    const action = {
      type: 'UNKNOWN_ACTION_TYPE'
    };
    const newState = searchReducer(state, action);
    expect(_.isEqual(state, newState)).to.equal(true);
  });

  it('should reset its (part of the) store when a user logs out', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.LOGOUT_PENDING
    };
    const newState = searchReducer(state, action);
    expect(_.isEqual(newState.documents, state.documents)).to.equal(true);
    expect(_.isEqual(newState.users, state.users)).to.equal(true);
  });

  it('should reset its store when an ExpiredTokenError occurs', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_DOCUMENTS_REJECTED,
      payload: { error: 'ExpiredTokenError' }
    };
    const newState = searchReducer(state, action);
    expect(_.isEqual(newState.documents, state.documents)).to.equal(true);
  });

  it('should reset its store when an InvalidTokenError occurs', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_DOCUMENTS_REJECTED,
      payload: { error: 'InvalidTokenError' }
    };
    const newState = searchReducer(state, action);
    expect(newState.status).to.equal('invalidToken');
    expect(_.isEqual(newState.documents, state.documents)).to.equal(true);
  });

  it('should update the store when a search for documents succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_DOCUMENTS_FULFILLED,
      query: 'foobar',
      payload: {
        message: 'Documents found.',
        documents: [{ title: 'A long story' }]
      }
    };
    const newState = searchReducer(state, action);
    expect(newState.status).to.equal('searchedDocuments');
    expect(newState.statusMessage).to.equal('Documents found.');
    expect(newState.documents.query).to.equal(action.payload.query);
    expect(Array.isArray(newState.documents.lastSearchResults)).to.equal(true);
    expect(newState.documents.lastSearchResults.length === 1).to.equal(true);
  });
});
