import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import CreateDocument from '../../../components/common/CreateDocument';

chai.use(chaiEnzyme());
const expect = chai.expect;

const spy = sinon.spy();

const props = {
  dispatch: spy,
  documentsStatus: 'fetchedUserDocuments',
  id: 3,
  modeMessage: 'Create',
  targetDocumentId: 8,
  token: 'RANDOM_TOKEN',
  title: 'Test',
  content: 'This is a test.',
  access: 'public',
  categories: 'novel',
  tags: 'book'
};

const wrapper = mount(<CreateDocument {...props} />);

describe('CreateDocument', () => {
  it('should have a form for creating documents', () => {
    expect(wrapper.find('form#create-document-form')).to.have.length(1);
  });

  it('should have a field for choosing access type', () => {
    expect(wrapper.find('select.create-doc-select-access')).to.have.length(1);
  });

  it('should have fields for stating the title, content etc of the document', () => {
    expect(wrapper.find('.create-doc-text-input')).to.have.length(4);
  });

  it('should show a button for creating the document', () => {
    expect(wrapper.find('button.create-document-btn')).to.have.length(1);
  });

  it('should be able to create a document', () => {
    const confirmBtn = wrapper.find('button.create-document-btn');
    confirmBtn.simulate('click');
    expect(spy.calledOnce).to.equal(true);
  });
});
