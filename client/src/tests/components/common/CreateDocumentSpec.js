import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import CreateDocument from '../../../components/common/CreateDocument';

chai.use(chaiEnzyme());
const expect = chai.expect;

const dispatchSpy = sinon.spy();

const oldDocument = {
  title: 'Test',
  content: 'This is a test.',
  access: 'public',
  categories: 'novel',
  tags: 'book'
};

const props = {
  dispatch: dispatchSpy,
  documentsStatus: 'fetchedUserDocuments',
  id: 3,
  modeMessage: 'Create',
  targetDocumentId: 8,
  token: 'RANDOM_TOKEN',
  ...oldDocument
};

const wrapper = mount(<CreateDocument {...props} />);

describe('CreateDocument', () => {
  it('should have a form for creating documents', () => {
    expect(wrapper.find('form#create-document-form')).to.have.length(1);
  });

  it('should have a field for choosing access type', () => {
    expect(wrapper.find('#create_doc_content_editor'))
      .to.have.length(1);
  });

  it('should have fields for stating the title, content etc of the document', () => {
    expect(wrapper.find('.create-doc-text-input')).to.have.length(3);
  });

  it('should show a button for creating the document', () => {
    expect(wrapper.find('#create-document-btn')).to.have.length(1);
  });

  it('should be able to receive a document\'s access type', () => {
    const updateAccessSpy = sinon.spy(wrapper.instance(), 'updateAccess');
    wrapper.update();
    const accessInput = wrapper.find('#new-document-access');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'role' }
    };
    accessInput.simulate('change', mockEvent);

    expect(updateAccessSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive a document\'s title', () => {
    const updateTitleSpy = sinon.spy(wrapper.instance(), 'updateTitle');
    wrapper.update();
    const titleInput = wrapper.find('#new-document-title');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New title' }
    };
    titleInput.simulate('change', mockEvent);

    expect(updateTitleSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive a document\'s categories', () => {
    const updateCategoriesSpy = sinon.spy(wrapper.instance(), 'updateCategories');
    wrapper.update();
    const categoriesInput = wrapper.find('#new-document-categories');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New category' }
    };
    categoriesInput.simulate('change', mockEvent);

    expect(updateCategoriesSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive a document\'s tags', () => {
    const updateTagsSpy = sinon.spy(wrapper.instance(), 'updateTags');
    wrapper.update();
    const tagsInput = wrapper.find('#new-document-tags');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New tag' }
    };
    tagsInput.simulate('change', mockEvent);

    expect(updateTagsSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive a document\'s content', () => {
    const updateContentSpy = sinon.spy(wrapper.instance(), 'updateContent');
    wrapper.update();
    const contentInput = wrapper.find('#create_doc_content_editor');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New content' }
    };
    contentInput.simulate('change', mockEvent);

    expect(updateContentSpy.called).to.equal(true);
  });


  it('should validate each field before creating a document', () => {
    const newWrapper = mount(<CreateDocument {...props} />);
    const updateDocumentBtn = newWrapper.find('#create-document-btn');
    let errorMsg;

    errorMsg = 'Supply a title that has two or more characters that are not whitespace.';
    newWrapper.setState({ ...oldDocument, title: '' });
    updateDocumentBtn.simulate('click');
    expect(newWrapper.instance().hasValidTitle()).to.equal(false);
    expect(newWrapper.state().errorMessage).to.equal(errorMsg);

    errorMsg = 'Add two or more comma-separated categories that aren\'t merely whitespace.';
    newWrapper.setState({ ...oldDocument, categories: '' });
    updateDocumentBtn.simulate('click');
    expect(newWrapper.instance().hasValidCategories()).to.equal(false);
    expect(newWrapper.state().errorMessage).to.equal(errorMsg);

    errorMsg = 'Please supply two or more comma-separated tags that aren\'t merely whitespace.';
    newWrapper.setState({ ...oldDocument, tags: '' });
    updateDocumentBtn.simulate('click');
    expect(newWrapper.instance().hasValidTags()).to.equal(false);
    expect(newWrapper.state().errorMessage).to.equal(errorMsg);

    errorMsg = 'Supply document content that has two or more characters that are not whitespace.';
    newWrapper.setState({ ...oldDocument, content: '' });
    updateDocumentBtn.simulate('click');
    expect(newWrapper.instance().hasValidContent()).to.equal(false);
    expect(newWrapper.state().errorMessage).to.equal(errorMsg);
  });

  it('should be able to create a document', () => {
    wrapper.setState(oldDocument);
    const attemptDocumentCreationSpy =
      sinon.spy(wrapper.instance(), 'attemptDocumentCreation');
    wrapper.update();
    const createDocBtn = wrapper.find('#create-document-btn');
    createDocBtn.simulate('click');

    expect(attemptDocumentCreationSpy.calledOnce).to.equal(true);
    expect(dispatchSpy.calledOnce).to.equal(true);
  });
});
