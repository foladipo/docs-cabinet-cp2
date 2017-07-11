import chai from 'chai';
import sinon from 'sinon';
import MockHttpClient from '../MockHttpClient';
import * as ActionTypes from '../../constants';
import { updateUser } from '../../actions/UserActions';

const expect = chai.expect;

describe('updateUser', () => {
  it('should dispatch all its composite actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const targetUserId = 12;
    const updateInfo = { firstName: 'Crawford' };
    const updateUserActions = updateUser(token, targetUserId, updateInfo);
    const spy = sinon.spy();
    updateUserActions(spy, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.UPDATE_USER_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.UPDATE_USER_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });
});
