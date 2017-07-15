import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ViewAllDocumentsPage from '../../../components/dashboardPages/ViewAllDocumentsPage';
import PlainDocument from '../../../components/common/PlainDocument';

chai.use(chaiEnzyme());
const expect = chai.expect;

const dispatchSpy = sinon.spy();
const props = {
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
      documents: [],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    allDocumentsCount: 0,
    allDocuments: {
      documents: [],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    status: 'fetchedAllDocuments',
    statusMessage: 'Documents found.',
    targetDocumentId: -1,
    documentToUpdate: {}
  },
};

const wrapper = mount(<ViewAllDocumentsPage {...props} />);

describe('ViewAllDocumentsPage', () => {
  it('should have an HTML class of all-documents-page', () => {
    expect(wrapper).to.have.className('all-documents-page');
  });

  it('should show a list of all documents', () => {
    wrapper.setProps({
      documents: {
        allDocuments: {
          documents: [
            {
              title: 'Something',
              access: 'public',
              content: 'Something',
              tags: 'Something',
              categories: 'Something',
              User: {
                id: 87,
                firstName: 'foo',
                lastName: 'bar'
              }
            }
          ]
        }
      }
    });
    expect(wrapper.find(PlainDocument)).to.have.length(1);
  });
});
