import chai from 'chai';
import sinon from 'sinon';
import { ActionTypes } from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { searchUsers } from '../../../actions/SearchActions';

const expect = chai.expect;

describe('searchUsers', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const query = 'foo';
    const searchUsersActions =
      searchUsers(token, query);
    const spy = sinon.spy();
    searchUsersActions(spy, undefined, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_USERS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_USERS_FULFILLED,
        payload: {
          message: 'Request successful.',
          query
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const searchUsersActions = searchUsers();
    const spy = sinon.spy();
    searchUsersActions(spy, undefined, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_USERS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_USERS_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
