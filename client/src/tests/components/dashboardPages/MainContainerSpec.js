import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { SideNav } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import MockRouter from 'react-mock-router';
import sinon from 'sinon';
import { MainContainer } from '../../../components/dashboardPages/MainContainer';

chai.use(chaiEnzyme());
const expect = chai.expect;

const dispatchSpy = sinon.spy();

const props = {
  dispatch: dispatchSpy,
  user: {
    isLoggedIn: true,
    isLoggingIn: false,
    isLoggingOut: false,
    token: 'RANDOM_TOKEN',
    user: { id: 8, roleId: 1 },
    allUsersCount: 0,
    allUsers: {
      users: [],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    status: 'loggedIn',
    statusMessage: 'Logged in successfully.',
    deletedUserId: -1,
    userToUpdate: {}
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
    status: 'documentCreated',
    statusMessage: 'Documents created.',
    targetDocumentId: -1,
    documentToUpdate: {}
  }
};

const wrapper = mount(
  <MockRouter>
    <MainContainer {...props} />
  </MockRouter>
);

describe('MainContainer', () => {
  it('should have an HTML id of authenticated-user-area', () => {
    expect(wrapper).to.have.id('authenticated-user-area');
  });

  it('should have a menu', () => {
    expect(wrapper.find('#dashboard-menu-btn')).to.have.length(1);
    expect(wrapper.find(SideNav)).to.have.length(1);
    // expect(wrapper.find(Switch)).to.have.length(1);
  });

  it('should have a button for logging out', () => {
    const logOutBtn = wrapper.find('#logout-btn');
    logOutBtn.simulate('click');
    expect(dispatchSpy.calledOnce).to.equal(true);
  });

  it('should redirect a user to the homepage if he/she logs out', () => {
    expect(wrapper.find(Redirect)).to.have.length(0);

    const newProps = Object.assign({}, props);
    newProps.user.isLoggedIn = false;
    const newWrapper = mount(
      <MockRouter>
        <MainContainer {...newProps} />
      </MockRouter>
    );
    expect(newWrapper.find(Redirect)).to.have.length(1);
  });

  it('should log a user out after he/she deletes his/her account', () => {
    expect(wrapper.find(Redirect)).to.have.length(0);

    const newProps = Object.assign({}, props);
    newProps.user.status = 'deletedUser';
    newProps.user.deletedUserId = newProps.user.user.id;
    const newWrapper = mount(
      <MockRouter>
        <MainContainer {...newProps} />
      </MockRouter>
    );
    expect(newWrapper.find(Redirect)).to.have.length(1);
  });
});
