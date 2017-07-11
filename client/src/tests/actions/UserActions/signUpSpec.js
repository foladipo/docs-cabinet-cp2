import chai from 'chai';
import sinon from 'sinon';
import * as ActionTypes from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { signUp } from '../../../actions/UserActions';

const expect = chai.expect;

describe('signUp', () => {
  it('should dispatch its success actions correctly', () => {
    const firstName = 'Segun';
    const lastName = 'Akinwande';
    const email = 'segun@example.com';
    const password = '12ab!@AB';
    const signUpActions = signUp(firstName, lastName, email, password);
    const spy = sinon.spy();
    signUpActions(spy, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SIGN_UP_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SIGN_UP_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const firstName = 'Segun';
    const lastName = 'Akinwande';
    const email = 'segun@example.com';
    const password = '12ab!@AB';
    const signUpActions = signUp(firstName, lastName, email, password);
    const spy = sinon.spy();
    signUpActions(spy, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SIGN_UP_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SIGN_UP_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
