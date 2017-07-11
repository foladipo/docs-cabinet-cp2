import chai from 'chai';
import sinon from 'sinon';
import MockHttpClient from '../MockHttpClient';
import * as ActionTypes from '../../constants';
import { login } from '../../actions/UserActions';

const expect = chai.expect;

describe('login', () => {
  it('should dispatch all its composite actions correctly', () => {
    const email = 'blah@example.com';
    const password = '12ab!@AB';
    const loginActions = login(email, password);
    const spy = sinon.spy();
    loginActions(spy, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.LOGIN_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.LOGIN_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });
});
