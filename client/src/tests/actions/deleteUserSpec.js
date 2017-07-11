import chai from 'chai';
import sinon from 'sinon';
import MockHttpClient from '../MockHttpClient';
import * as ActionTypes from '../../constants';
import { deleteUser } from '../../actions/UserActions';

const expect = chai.expect;

describe('deleteUser', () => {
  it('should dispatch all its composite actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const targetUserId = 12;
    const deleteUserActions = deleteUser(token, targetUserId);
    const spy = sinon.spy();
    deleteUserActions(spy, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.DELETE_USER_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.DELETE_USER_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });
});
