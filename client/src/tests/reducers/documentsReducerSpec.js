import chai from 'chai';
import lodash from 'lodash';
import { ActionTypes } from '../../constants';
import documentsReducer from '../../reducers/documentsReducer';

const expect = chai.expect;

describe('documentsReducer', () => {
  const getDefaultState = () => ({
    userDocumentsCount: 0,
    userDocuments: {
      documents: [],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    allDocumentsCount: 0,
    allDocuments: {
      documents: [],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    status: 'fetchingAllDocuments',
    statusMessage: 'Loading documents... Please wait...',
    targetDocumentId: -1
  });

  it('should be defined', () => {
    expect(documentsReducer).to.not.equal(undefined);
  });

  it('should update the store when a retrieval of a user\'s documents is started', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_USER_DOCUMENTS_PENDING
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('fetchingUserDocuments');
    expect(newState.statusMessage).to.equal('Loading documents... Please wait...');
  });

  it('should update the store when a retrieval of a user\'s documents fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_USER_DOCUMENTS_REJECTED,
      payload: {}
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('fetchUserDocumentsFailed');
    expect(newState.statusMessage).to.equal('Failed to load documents. Please try again.');
  });

  it('should update the store when a retrieval of a user\'s documents succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_USER_DOCUMENTS_FULFILLED,
      payload: {
        message: 'Documents found.',
        documents: [{ title: 'A long story' }]
      }
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('userDocumentsFetched');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.userDocuments.documents)).to.equal(true);
    expect(newState.userDocuments.documents.length === 1).to.equal(true);
  });

  it('should update the store when a retrieval of all documents is started', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_ALL_DOCUMENTS_PENDING
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('fetchingAllDocuments');
    expect(newState.statusMessage).to.equal('Loading documents... Please wait...');
  });

  it('should update the store when a retrieval of all documents fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_ALL_DOCUMENTS_REJECTED,
      payload: {}
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('fetchAllDocumentsFailed');
    expect(newState.statusMessage).to.equal('Failed to load documents. Please try again.');
  });

  it('should update the store when a retrieval of all documents succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_ALL_DOCUMENTS_FULFILLED,
      payload: {
        message: 'Documents found.',
        documents: [{ title: 'A long story' }]
      }
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('allDocumentsFetched');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.allDocuments.documents)).to.equal(true);
    expect(newState.allDocuments.documents.length === 1).to.equal(true);
  });

  it('should update the store when document creation starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.CREATE_DOCUMENT_PENDING
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('creatingDocument');
    expect(newState.statusMessage)
      .to.equal('Creating document... Please wait...');
  });

  it('should update the store when document creation fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.CREATE_DOCUMENT_REJECTED,
      payload: {}
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('documentCreationFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to create document. Please try again.');
  });

  it('should update the store when document creation succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.CREATE_DOCUMENT_FULFILLED,
      payload: {
        message: 'Documents found.',
        documents: [{ title: 'A long story' }]
      }
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('documentCreated');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.userDocuments.documents)).to.equal(true);
    expect(newState.userDocuments.documents.length === 1).to.equal(true);
  });

  it('should update the store when document deletion starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.DELETE_DOCUMENT_PENDING,
      payload: { targetDocumentId: 1 }
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('deletingDocument');
    expect(newState.statusMessage)
      .to.equal('Deleting document... Please wait...');
  });

  it('should update the store when document deletion fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.DELETE_DOCUMENT_REJECTED,
      payload: {}
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('documentDeletionFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to delete document. Please try again.');
  });

  it('should update the store when document deletion succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.DELETE_DOCUMENT_FULFILLED,
      payload: {
        message: 'Documents deleted.',
        documents: [{ id: 1, title: 'A long story' }],
        targetDocumentId: 1
      }
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('documentDeleted');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.userDocuments.documents)).to.equal(true);
    expect(newState.userDocuments.documents.length === 0).to.equal(true);
  });

  it('should update the store when a document update starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.UPDATE_DOCUMENT_PENDING,
      payload: { targetDocumentId: 1 }
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('updatingDocument');
    expect(newState.statusMessage)
      .to.equal('Updating document... Please wait...');
  });

  it('should update the store when a document update fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.UPDATE_DOCUMENT_REJECTED,
      payload: {}
    };
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('updateDocumentFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to update document. Please try again.');
  });

  it('should update the store when a document update succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.UPDATE_DOCUMENT_FULFILLED,
      payload: {
        message: 'Documents updated.',
        documents: [{ id: 1, title: 'A long story' }],
        targetDocumentId: 1
      }
    };
    state.userDocuments.documents[0] = action.payload.documents[0];
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('documentUpdated');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.userDocuments.documents)).to.equal(true);
    expect(newState.userDocuments.documents.length === 1).to.equal(true);
  });

  it('should reset the store for an InvalidTokenError', () => {
    const state = {
      userDocumentsCount: 1,
      userDocuments: {
        documents: [{ id: 1, title: 'Foobar' }],
        page: 0,
        pageSize: 0,
        pageCount: 0,
        totalCount: 0
      },
      allDocumentsCount: 1,
      allDocuments: [{ id: 2, title: 'Quux' }, { id: 1, title: 'Foobar' }],
      status: 'userDocumentsFetched',
      statusMessage: 'Updating document... Please wait...',
      targetDocumentId: 1
    };
    const action = {
      type: ActionTypes.UPDATE_DOCUMENT_REJECTED,
      payload: {
        error: 'InvalidTokenError'
      }
    };
    const newState = documentsReducer(state, action);
    expect(newState.userDocumentsCount).to.equal(0);
    expect(newState.userDocuments.documents.length).to.equal(0);
    expect(newState.allDocumentsCount).to.equal(0);
    expect(newState.allDocuments.documents.length).to.equal(0);
  });

  it('should NOT update the store for unknown action types', () => {
    const state = getDefaultState();
    const action = {
      type: 'UNKNOWN_ACTION_TYPE'
    };
    const newState = documentsReducer(state, action);
    expect(lodash.isEqual(state, newState)).to.equal(true);
  });

  it('should reset its (part of the) store when a user logs out', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.LOGOUT_PENDING
    };
    const newState = documentsReducer(state, action);
    expect(lodash.isEqual(newState.userDocuments, state.userDocuments))
      .to.equal(true);
    expect(lodash.isEqual(newState.allDocuments, state.allDocuments))
      .to.equal(true);
  });

  it('should reset its store when an ExpiredTokenError occurs', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_DOCUMENTS_REJECTED,
      payload: { error: 'ExpiredTokenError' }
    };
    const newState = documentsReducer(state, action);
    expect(lodash.isEqual(newState.userDocuments, state.userDocuments))
      .to.equal(true);
    expect(lodash.isEqual(newState.allDocuments, state.allDocuments))
      .to.equal(true);
  });

  it('should reset its store when an InvalidTokenError occurs', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SEARCH_DOCUMENTS_REJECTED,
      payload: { error: 'InvalidTokenError' }
    };
    const newState = documentsReducer(state, action);
    expect(lodash.isEqual(newState.userDocuments, state.userDocuments))
      .to.equal(true);
    expect(lodash.isEqual(newState.allDocuments, state.allDocuments))
      .to.equal(true);
  });
});
