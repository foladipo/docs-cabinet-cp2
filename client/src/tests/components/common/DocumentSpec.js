import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Modal } from 'react-materialize';
import Document from '../../../components/common/Document';
import ConfirmDocumentDeletion from '../../../components/common/ConfirmDocumentDeletion';

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
  tags: 'book',
  User: {
    id: 7,
    firstName: 'Dora',
    lastName: 'Akunyili'
  },
  currentUserId: 7
};

const wrapper = shallow(<Document {...props} />);

describe('Document', () => {
  it('should have an HTML class of single-document', () => {
    expect(wrapper).to.have.className('single-document');
  });

  it('should be a small, card-like section', () => {
    expect(wrapper.find('div.small.card')).to.have.length(1);
  });

  it('should have a button for editing the document', () => {
    expect(wrapper.find('[icon="mode_edit"]')).to.have.length(1);
  });

  it('should contain modals for viewing or deleting the document', () => {
    expect(wrapper.find(Modal)).to.have.length(2);
  });

  it('should confirm before deleting a document', () => {
    expect(wrapper.find(ConfirmDocumentDeletion)).to.have.length(1);
  });
});
