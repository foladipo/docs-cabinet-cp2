import chai from 'chai';
import sinon from 'sinon';
import * as ActionTypes from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { updateDocument } from '../../../actions/DocumentActions';

const expect = chai.expect;

describe('updateDocument', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const targetDocumentId = 12;
    const updateInfo = { title: 'Ready... set... go!' };
    const updateDocumentActions =
      updateDocument(token, targetDocumentId, updateInfo);
    const spy = sinon.spy();
    updateDocumentActions(spy, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.UPDATE_DOCUMENT_PENDING,
        payload: { targetDocumentId }
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.UPDATE_DOCUMENT_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const targetDocumentId = 12;
    const updateDocumentActions = updateDocument(token, targetDocumentId);
    const spy = sinon.spy();
    updateDocumentActions(spy, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.UPDATE_DOCUMENT_PENDING,
        payload: { targetDocumentId }
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.UPDATE_DOCUMENT_REJECTED,
        payload: {
          targetDocumentId,
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
