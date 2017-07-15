import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import MockRouter from 'react-mock-router';
import ViewUserDocumentsPage from '../../../components/dashboardPages/ViewUserDocumentsPage';
import Document from '../../../components/common/Document';

chai.use(chaiEnzyme());
const expect = chai.expect;

const dispatchSpy = sinon.spy();
const props = {
  location,
  dispatch: dispatchSpy,
  user: {
    isLoggedIn: true,
    isLoggingIn: false,
    isLoggingOut: false,
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
    status: 'deletedDocument',
    statusMessage: 'Document deleted.',
    targetDocumentId: -1,
    documentToUpdate: {}
  }
};

const wrapper = mount(<ViewUserDocumentsPage {...props} />);

describe('ViewUserDocumentsPage', () => {
  it('should have an HTML id of user-documents-page', () => {
    expect(wrapper).to.have.id('user-documents-page');
  });

  it('should auto-fetch a list of users when it is displayed', () => {
    expect(dispatchSpy.calledOnce).to.equal(true);
  });

  it('should show a list of a user\'s documents', () => {
    const newProps = Object.assign({}, props);
    newProps.documents.userDocuments = {
      documents: [
        {
          id: 37,
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
      ],
      page: 1,
      pageSize: 10,
      pageCount: 1,
      totalCount: 1
    };
    const newWrapper =
      mount(<MockRouter><ViewUserDocumentsPage {...newProps} /></MockRouter>);
    expect(newWrapper.find(Document)).to.have.length(1);
  });
});
