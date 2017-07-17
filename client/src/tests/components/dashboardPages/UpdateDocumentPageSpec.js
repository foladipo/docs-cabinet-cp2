import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import UpdateDocumentPage from '../../../components/dashboardPages/UpdateDocumentPage';

chai.use(chaiEnzyme());
const expect = chai.expect;

const dispatchSpy = sinon.spy();
const oldDocument = {
  title: 'Old title',
  content: 'Old content',
  tags: 'Old tags',
  categories: 'Old categories',
  access: 'public',
};
const props = {
  location: {
    pathname: '/dashboard/updateDocument/78'
  },
  dispatch: dispatchSpy,
  user: {
    token: 'RANDOM_TOKEN',
    user: {
      id: 4
    }
  },
  documents: {
    userDocumentsCount: 0,
    userDocuments: {
      documents: [oldDocument],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    status: 'userDocumentsFetched',
    statusMessage: 'Documents found.'
  }
};

const wrapper = mount(<UpdateDocumentPage {...props} />);
wrapper.setState({ targetDocument: oldDocument });

describe('UpdateDocumentPage', () => {
  it('should have an HTML id of update-document-page', () => {
    expect(wrapper).to.have.id('update-document-page');
  });

  it('should show status/error messages to any user', () => {
    expect(wrapper.find('.msg-container .success-msg')).to.have.length(1);
    expect(wrapper.find('.msg-container .error-msg')).to.have.length(2);
  });

  it('should have a form for updating a document', () => {
    expect(wrapper.find('#update-document-form')).to.have.length(1);
  });

  it('should NOT try to update a document if none of its fields have changed', () => {
    props.dispatch = sinon.spy();
    const newWrapper = mount(<UpdateDocumentPage {...props} />);
    newWrapper.setState({ targetDocument: oldDocument, ...oldDocument });
    const attemptDocumentUpdateSpy =
      sinon.spy(newWrapper.instance(), 'attemptDocumentUpdate');
    newWrapper.update();
    const updateDocumentBtn = newWrapper.find('#update-document-btn');
    updateDocumentBtn.simulate('click');

    expect(attemptDocumentUpdateSpy.calledOnce).to.equal(true);
    expect(newWrapper.instance().isUpdate()).to.equal(false);
  });

  it('should validate all its input fields', () => {
    const newWrapper = mount(<UpdateDocumentPage {...props} />);

    newWrapper.setState({ ...oldDocument, title: '' });
    expect(newWrapper.instance().hasValidTitle()).to.equal(false);

    newWrapper.setState({ ...oldDocument, categories: '' });
    expect(newWrapper.instance().hasValidCategories()).to.equal(false);

    newWrapper.setState({ ...oldDocument, tags: '' });
    expect(newWrapper.instance().hasValidTags()).to.equal(false);

    newWrapper.setState({ ...oldDocument, content: '' });
    expect(newWrapper.instance().hasValidContent()).to.equal(false);
  });

  it('should be able to update a document\'s access type', () => {
    const updateAccessSpy = sinon.spy(wrapper.instance(), 'updateAccess');
    wrapper.update();
    const filterInput = wrapper.find('#update-access');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'role' }
    };
    filterInput.simulate('change', mockEvent);

    expect(updateAccessSpy.calledOnce).to.equal(true);
  });

  it('should be able to update a document\'s title', () => {
    const updateTitleSpy = sinon.spy(wrapper.instance(), 'updateTitle');
    wrapper.update();
    const filterInput = wrapper.find('#update-title');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New title' }
    };
    filterInput.simulate('change', mockEvent);

    expect(updateTitleSpy.calledOnce).to.equal(true);
  });

  it('should be able to update a document\'s categories', () => {
    const updateCategoriesSpy = sinon.spy(wrapper.instance(), 'updateCategories');
    wrapper.update();
    const filterInput = wrapper.find('#update-categories');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New category' }
    };
    filterInput.simulate('change', mockEvent);

    expect(updateCategoriesSpy.calledOnce).to.equal(true);
  });

  it('should be able to update a document\'s tags', () => {
    const updateTagsSpy = sinon.spy(wrapper.instance(), 'updateTags');
    wrapper.update();
    const filterInput = wrapper.find('#update-tags');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New tag' }
    };
    filterInput.simulate('change', mockEvent);

    expect(updateTagsSpy.calledOnce).to.equal(true);
  });

  it('should be able to update a document\'s content', () => {
    const updateContentSpy = sinon.spy(wrapper.instance(), 'updateContent');
    wrapper.update();
    const filterInput = wrapper.find('#update-content');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'New content' }
    };
    filterInput.simulate('change', mockEvent);

    expect(updateContentSpy.calledOnce).to.equal(true);
  });

  it('should be able to update a document', () => {
    const attemptDocumentUpdateSpy =
      sinon.spy(wrapper.instance(), 'attemptDocumentUpdate');
    wrapper.update();
    const updateDocumentBtn = wrapper.find('#update-document-btn');
    updateDocumentBtn.simulate('click');

    expect(attemptDocumentUpdateSpy.calledOnce).to.equal(true);
    expect(dispatchSpy.called).to.equal(true);
  });
});
