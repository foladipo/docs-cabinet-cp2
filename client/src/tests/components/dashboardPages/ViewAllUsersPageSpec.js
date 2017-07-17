import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import MockRouter from 'react-mock-router';
import ViewAllUsersPage from '../../../components/dashboardPages/ViewAllUsersPage';
import User from '../../../components/common/User';

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
    },
    allUsersCount: 0,
    allUsers: {
      users: [],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    status: 'fetchedAllDocuments',
    statusMessage: 'Documents found.'
  }
};

const wrapper = mount(<MockRouter><ViewAllUsersPage {...props} /></MockRouter>);

describe('ViewAllUsersPage', () => {
  it('should have an HTML id of all-users-page', () => {
    expect(wrapper.find('#all-users-page')).to.have.length(1);
  });

  it('should auto-fetch a list of users', () => {
    expect(dispatchSpy.calledOnce).to.equal(true);
  });

  it('should show a list of all the users of this project', () => {
    const newProps = Object.assign({}, props);
    newProps.user.allUsers = {
      users: [
        {
          id: 72,
          firstName: 'Charlotte',
          lastName: 'Bassey',
          username: 'charlotte@example.com',
          roleId: 0
        }
      ],
      page: 1,
      pageSize: 10,
      pageCount: 1,
      totalCount: 1
    };
    const newWrapper =
      mount(<MockRouter><ViewAllUsersPage {...newProps} /></MockRouter>);
    expect(newWrapper.find(User)).to.have.length(1);
  });
});
