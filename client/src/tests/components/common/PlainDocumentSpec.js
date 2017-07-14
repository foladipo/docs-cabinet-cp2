import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { Modal } from 'react-materialize';
import sinon from 'sinon';
import PlainDocument from '../../../components/common/PlainDocument';

chai.use(chaiEnzyme());
const expect = chai.expect;

const spy = sinon.spy();

const props = {
  dispatch: spy,
  documentsStatus: 'fetchedUserDocuments',
  id: 3,
  targetDocumentId: 8,
  token: 'RANDOM_TOKEN',
  title: 'Test',
  content: 'This is a test.',
  access: 'public',
  categories: 'novel',
  tags: 'book',
  User: {
    id: 7,
    firstName: 'Gbenga',
    lastName: 'Adeyemi'
  },
  currentUserId: 4
};

const wrapper = mount(<PlainDocument {...props} />);

describe('PlainDocument', () => {
  it('should have an HTML class of plain-document', () => {
    expect(wrapper).to.have.className('plain-document');
  });

  it('should contain a small, card-like section', () => {
    expect(wrapper.find('div.small.card')).to.have.length(1);
  });

  it('should contain the document\'s image', () => {
    expect(wrapper.find('.card-image')).to.have.length(1);
  });

  it('should have a section for the card\'s title', () => {
    expect(wrapper.find('span.card-title')).to.have.length(1);
  });

  it('should have a section for the card\'s content', () => {
    expect(wrapper.find('.card-content')).to.have.length(1);
  });

  it('should contain a modal for displaying the details of the document', () => {
    expect(wrapper.find(Modal)).to.have.length(1);
  });
});
