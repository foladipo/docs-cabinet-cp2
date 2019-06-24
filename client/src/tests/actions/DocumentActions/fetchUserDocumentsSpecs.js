import chai from 'chai';
import sinon from 'sinon';
import { ActionTypes } from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { fetchUserDocuments } from '../../../actions/DocumentActions';

const expect = chai.expect;

describe('fetchUserDocuments', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const targetUserId = 12;
    const limit = 10;
    const offset = 0;
    const fetchUserDocumentsActions =
      fetchUserDocuments(token, targetUserId, limit, offset);
    const spy = sinon.spy();
    fetchUserDocumentsActions(spy, undefined, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_USER_DOCUMENTS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_USER_DOCUMENTS_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const fetchUserDocumentsActions = fetchUserDocuments();
    const spy = sinon.spy();
    fetchUserDocumentsActions(spy, undefined, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_USER_DOCUMENTS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_USER_DOCUMENTS_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
