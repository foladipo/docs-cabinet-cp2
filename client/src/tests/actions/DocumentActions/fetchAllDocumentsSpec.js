import chai from 'chai';
import sinon from 'sinon';
import * as ActionTypes from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { fetchAllDocuments } from '../../../actions/DocumentActions';

const expect = chai.expect;

describe('fetchAllDocuments', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const limit = 10;
    const offset = 0;
    const fetchAllDocumentsActions =
      fetchAllDocuments(token, limit, offset);
    const spy = sinon.spy();
    fetchAllDocumentsActions(spy, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_DOCUMENTS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_DOCUMENTS_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const fetchAllDocumentsActions = fetchAllDocuments();
    const spy = sinon.spy();
    fetchAllDocumentsActions(spy, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_DOCUMENTS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.FETCH_ALL_DOCUMENTS_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
