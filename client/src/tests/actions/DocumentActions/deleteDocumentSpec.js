import chai from 'chai';
import sinon from 'sinon';
import { ActionTypes } from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { deleteDocument } from '../../../actions/DocumentActions';

const expect = chai.expect;

describe('deleteDocument', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const targetDocumentId = 12;
    const deleteDocumentActions = deleteDocument(token, targetDocumentId);
    const spy = sinon.spy();
    deleteDocumentActions(spy, undefined, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.DELETE_DOCUMENT_PENDING,
        payload: { targetDocumentId }
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.DELETE_DOCUMENT_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const targetDocumentId = 12;
    const deleteDocumentActions = deleteDocument(token, targetDocumentId);
    const spy = sinon.spy();
    deleteDocumentActions(spy, undefined, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.DELETE_DOCUMENT_PENDING,
        payload: { targetDocumentId }
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.DELETE_DOCUMENT_REJECTED,
        payload: {
          targetDocumentId,
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
