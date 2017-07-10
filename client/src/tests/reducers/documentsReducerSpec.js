import chai from 'chai';
import * as ActionTypes from '../../constants';
import documentsReducer from '../../reducers/documentsReducer';

const expect = chai.expect;

describe('documentsReducer', () => {
  const getDefaultState = () => ({
    userDocumentsCount: 0,
    userDocuments: [],
    allDocumentsCount: 0,
    allDocuments: [],
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
    expect(Array.isArray(newState.userDocuments)).to.equal(true);
    expect(newState.userDocuments.length === 1).to.equal(true);
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
    expect(Array.isArray(newState.allDocuments)).to.equal(true);
    expect(newState.allDocuments.length === 1).to.equal(true);
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
    expect(Array.isArray(newState.userDocuments)).to.equal(true);
    expect(newState.userDocuments.length === 1).to.equal(true);
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
    expect(Array.isArray(newState.userDocuments)).to.equal(true);
    expect(newState.userDocuments.length === 0).to.equal(true);
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
    expect(newState.status).to.equal('documentUpdateFailed');
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
    state.userDocuments[0] = action.payload.documents[0];
    const newState = documentsReducer(state, action);
    expect(newState.status).to.equal('documentUpdated');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.userDocuments)).to.equal(true);
    expect(newState.userDocuments.length === 1).to.equal(true);
  });
});
