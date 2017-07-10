import chai from 'chai';
import * as ActionTypes from '../../constants';
import userReducer from '../../reducers/userReducer';

const expect = chai.expect;

describe('userReducer', () => {
  const getDefaultState = () => ({
    isLoggedIn: false,
    isLoggingIn: false,
    isLoggingOut: false,
    token: 'foobar',
    user: {},
    allUsers: [],
    status: '',
    statusMessage: '',
    deletedUserId: -1
  });

  it('should be defined', () => {
    expect(userReducer).to.not.equal(undefined);
  });

  it('should update the store when the sign up process starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SIGN_UP_PENDING
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('signingUp');
    expect(newState.statusMessage)
      .to.equal('Creating your account... Please wait...');
    expect(newState.isLoggingIn).to.equal(true);
    expect(newState.isLoggedIn).to.equal(false);
  });

  it('should update the store when the sign up process fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SIGN_UP_REJECTED,
      payload: {}
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('signUpFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to sign up. Please try again.');
    expect(newState.isLoggingIn).to.equal(false);
    expect(newState.isLoggedIn).to.equal(false);
  });

  it('should update the store when the sign up process succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.SIGN_UP_FULFILLED,
      payload: {
        message: 'Signed up successfully.',
        token: 'SOMETHING_RANDOM',
        user: { firstName: 'Don Quixote' }
      }
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('signedUp');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(newState.token).to.equal(action.payload.token);
    expect(newState.user).to.equal(action.payload.user);
    expect(newState.isLoggingIn).to.equal(false);
    expect(newState.isLoggedIn).to.equal(true);
  });

  it('should update the store when the login process starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.LOGIN_PENDING
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('loggingIn');
    expect(newState.statusMessage)
      .to.equal('Logging in... Please wait...');
    expect(newState.isLoggingIn).to.equal(true);
    expect(newState.isLoggedIn).to.equal(false);
  });

  it('should update the store when the login process fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.LOGIN_REJECTED,
      payload: {}
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('loginFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to login. Please try again.');
    expect(newState.isLoggingIn).to.equal(false);
    expect(newState.isLoggedIn).to.equal(false);
  });

  it('should update the store when the login process succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.LOGIN_FULFILLED,
      payload: {
        message: 'Logged in successfully.',
        token: 'SOMETHING_RANDOM',
        user: { firstName: 'Don Quixote' }
      }
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('loggedIn');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(newState.token).to.equal(action.payload.token);
    expect(newState.user).to.equal(action.payload.user);
    expect(newState.isLoggingIn).to.equal(false);
    expect(newState.isLoggedIn).to.equal(true);
  });

  it('should update the store when the logout process starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.LOGOUT_PENDING
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('loggingOut');
    expect(newState.statusMessage)
      .to.equal('Logging out... Please wait...');
    expect(newState.isLoggingOut).to.equal(true);
    expect(newState.isLoggedIn).to.equal(false);
    expect(newState.token).to.equal(null);
    expect(newState.user).to.equal(null);
  });

  it('should update the store when the logout process succeeds', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.LOGOUT_FULFILLED,
      payload: {
        message: 'You\'re now logged out.'
      }
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('loggedOut');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(newState.isLoggingOut).to.equal(false);
  });

  it('should update the store when fetching all users starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_ALL_USERS_PENDING
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('fetchingAllUsers');
    expect(newState.statusMessage)
      .to.equal('Fetching users... Please wait...');
  });

  it('should update the store when fetching all users fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.FETCH_ALL_USERS_REJECTED,
      payload: {}
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('fetchAllUsersFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to fetch users. Please try again.');
  });

  it('should update the store when fetching all users succeeds', () => {
    const state = getDefaultState();
    state.allUsers[0] = { firstName: 'Jane Doe' };
    const action = {
      type: ActionTypes.FETCH_ALL_USERS_FULFILLED,
      payload: {
        message: 'Successfully fetched users.',
        users: [{ firstName: 'Don Quixote' }]
      }
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('fetchedAllUsers');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.allUsers)).to.equal(true);
    expect(newState.allUsers.length === 2).to.equal(true);
  });

  it('should update the store when a user\'s profile update starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.UPDATE_USER_PENDING
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('updatingUser');
    expect(newState.statusMessage)
      .to.equal('Updating profile... Please wait...');
  });

  it('should update the store when a user\'s profile update fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.UPDATE_USER_REJECTED,
      payload: {}
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('updateUserFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to update this profile. Please try again.');
  });

  it('should update the store when a user\'s profile update succeeds', () => {
    const state = getDefaultState();
    state.allUsers[0] = { firstName: 'Jane Doe' };
    const action = {
      type: ActionTypes.UPDATE_USER_FULFILLED,
      payload: {
        message: 'Account updated.',
        users: [{ firstName: 'Donaldson Quixote' }]
      }
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('updatedUser');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.allUsers)).to.equal(true);
    expect(newState.allUsers.length === 1).to.equal(true);
  });

  it('should update the store when a user deletion starts', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.DELETE_USER_PENDING
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('deletingUser');
    expect(newState.statusMessage)
      .to.equal('Deleting account... Please wait...');
  });

  it('should update the store when a user deletion fails', () => {
    const state = getDefaultState();
    const action = {
      type: ActionTypes.DELETE_USER_REJECTED,
      payload: {}
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('userDeletionFailed');
    expect(newState.statusMessage)
      .to.equal('Failed to delete account. Please try again.');
  });

  it('should update the store when a user deletion succeeds', () => {
    const state = getDefaultState();
    state.allUsers[0] = { id: 1, firstName: 'Donaldson Quixote' };
    const action = {
      type: ActionTypes.DELETE_USER_FULFILLED,
      payload: {
        message: 'We hate to see you go! But your account was successfully deleted.',
        users: [{ id: 1, firstName: 'Donaldson Quixote' }]
      }
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('deletedUser');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(Array.isArray(newState.allUsers)).to.equal(true);
    expect(newState.allUsers.length === 0).to.equal(true);
  });

  it('should delete a user\'s own account and log him/her account out', () => {
    const state = getDefaultState();
    state.user = { id: 1, firstName: 'Donaldson Quixote' };
    const action = {
      type: ActionTypes.DELETE_USER_FULFILLED,
      payload: {
        message: 'We hate to see you go! But your account was successfully deleted.',
        users: [{ id: 1, firstName: 'Donaldson Quixote' }]
      }
    };
    const newState = userReducer(state, action);
    expect(newState.status).to.equal('deletedUser');
    expect(newState.statusMessage).to.equal(action.payload.message);
    expect(newState.isLoggedIn).to.equal(false);
    expect(newState.isLoggingIn).to.equal(false);
    expect(newState.isLoggingOut).to.equal(false);
    expect(newState.token).to.equal(null);
    expect(newState.user).to.equal(null);
  });
});
