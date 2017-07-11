import chai from 'chai';
import sinon from 'sinon';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import * as ActionTypes from '../../../constants';
import { login } from '../../../actions/UserActions';

const expect = chai.expect;

describe('login', () => {
  it('should dispatch its success actions correctly', () => {
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

  it('should dispatch all its failure actions correctly', () => {
    const loginActions = login();
    const spy = sinon.spy();
    loginActions(spy, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.LOGIN_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.LOGIN_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
