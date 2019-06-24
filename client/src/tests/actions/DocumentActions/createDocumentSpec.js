import chai from 'chai';
import sinon from 'sinon';
import { ActionTypes } from '../../../constants';
import MockHttpClient from '../../MockHttpClient';
import MockHttpErrorClient from '../../MockHttpErrorClient';
import { createDocument } from '../../../actions/DocumentActions';

const expect = chai.expect;

describe('createDocument', () => {
  it('should dispatch its success actions correctly', () => {
    const token = 'RANDOM_TOKEN';
    const title = 'Foo';
    const content = 'Lorem ipsum';
    const access = 'public';
    const categories = 'fiction';
    const tags = 'random';
    const createDocumentActions =
      createDocument(token, title, content, access, categories, tags);
    const spy = sinon.spy();
    createDocumentActions(spy, undefined, MockHttpClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.CREATE_DOCUMENT_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.CREATE_DOCUMENT_FULFILLED,
        payload: {
          message: 'Request successful.'
        }
      }
    )).to.equal(true);
  });

  it('should dispatch its failure actions correctly', () => {
    const createDocumentActions = createDocument();
    const spy = sinon.spy();
    createDocumentActions(spy, undefined, MockHttpErrorClient);
    expect(spy.calledTwice).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.CREATE_DOCUMENT_PENDING
      }
    )).to.equal(true);
    expect(spy.calledWith(
      {
        type: ActionTypes.CREATE_DOCUMENT_REJECTED,
        payload: {
          message: 'Request failed.'
        }
      }
    )).to.equal(true);
  });
});
