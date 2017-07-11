import chai from 'chai';
import sinon from 'sinon';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import * as ActionTypes from '../../../constants';
import { fetchAllUsers } from '../../../actions/UserActions';

const expect = chai.expect;

describe('fetchAllUsers', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const limit = 10;
    const offset = 0;
    const fetchAllUsersActions = fetchAllUsers(token, limit, offset);
    const spy = sinon.spy();
    fetchAllUsersActions(spy, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_USERS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_USERS_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const fetchAllUsersActions = fetchAllUsers();
    const spy = sinon.spy();
    fetchAllUsersActions(spy, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_USERS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_USERS_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
