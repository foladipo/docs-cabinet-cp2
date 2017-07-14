import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ConfirmDocumentDeletion from '../../../components/common/ConfirmDocumentDeletion';

chai.use(chaiEnzyme());
const expect = chai.expect;

const spy = sinon.spy();

const props = {
  dispatch: spy,
  documentsStatus: 'fetchedUserDocuments',
  id: 3,
  targetDocumentId: 8,
  token: 'RANDOM_TOKEN'
};

const wrapper = mount(<ConfirmDocumentDeletion {...props} />);

describe('ConfirmDocumentDeletion', () => {
  it('should have an HTML id of confirm-document-deletion', () => {
    expect(wrapper).to.have.id('confirm-document-deletion');
  });

  it('should show a message asking to confirm the deletion', () => {
    expect(wrapper.find('h3.center-align.red-text.text-lighten-2')).to.have.length(1);
  });

  it('should show a button for cancelling the deletion', () => {
    expect(wrapper.find('button.btn.red.right')).to.have.length(1);
  });

  it('should show a button for confirming the deletion', () => {
    expect(wrapper.find('button.btn.teal.lighten-1')).to.have.length(1);
  });

  it('should be able to delete a document', () => {
    const confirmBtn = wrapper.find('button.btn.red.right');
    confirmBtn.simulate('click');
    expect(spy.calledOnce).to.equal(true);
  });
});
