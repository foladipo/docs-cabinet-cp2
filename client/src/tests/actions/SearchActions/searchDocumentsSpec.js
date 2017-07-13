import chai from 'chai';
import sinon from 'sinon';
import * as ActionTypes from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { searchDocuments } from '../../../actions/SearchActions';

const expect = chai.expect;

describe('searchDocuments', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const query = 'foo';
    const searchDocumentsActions =
      searchDocuments(token, query);
    const spy = sinon.spy();
    searchDocumentsActions(spy, undefined, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_DOCUMENTS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_DOCUMENTS_FULFILLED,
        payload: {
          message: 'Request successful.',
          query
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const searchDocumentsActions = searchDocuments();
    const spy = sinon.spy();
    searchDocumentsActions(spy, undefined, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_DOCUMENTS_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.SEARCH_DOCUMENTS_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
