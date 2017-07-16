import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { Redirect } from 'react-router-dom';
import MockRouter from 'react-mock-router';
import sinon from 'sinon';
import UpdateUserPage from '../../../components/dashboardPages/UpdateUserPage';

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
      users: [
        {
          id: 67,
          firstName: 'Ada',
          lastName: 'Lovelace',
          username: 'ada@example.com',
          roleId: 0
        }
      ],
      page: 0,
      pageSize: 0,
      pageCount: 0,
      totalCount: 0
    },
    status: '',
    statusMessage: '',
    deletedUserId: -1,
    userToUpdate: {}
  },
  location: {
    pathname: '/dashboard/updateProfile/67'
  }
};

// const zap = mount(<UpdateUserPage {...props} />);
const updatePageNode = <UpdateUserPage {...props} />;
const outerWrapper = mount(
  <MockRouter>
    {updatePageNode}
  </MockRouter>
);

const wrapper = outerWrapper.at(0);

describe('UpdateUserPage', () => {
  it('should have an HTML id of update-user-page', () => {
    expect(wrapper).to.have.id('update-user-page');
  });

  it('should show status/error messages to any user', () => {
    expect(wrapper.find('.msg-container')).to.have.length(1);
  });

  it('should have a form for updating a document', () => {
    expect(wrapper.find('#update-user-form')).to.have.length(1);
  });

  it('should be able to receive the input of a user\'s role', () => {
    const mountedPage = mount(updatePageNode);
    const updateRoleIdSpy = sinon.spy(mountedPage.instance(), 'updateRoleId');
    mountedPage.update();
    const roleIdInput = mountedPage.find('#update-role-id');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 1 }
    };
    roleIdInput.simulate('change', mockEvent);
    expect(updateRoleIdSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive the input of a user\'s first name', () => {
    const mountedPage = mount(updatePageNode);
    const updateFirstNameSpy = sinon.spy(mountedPage.instance(), 'updateFirstName');
    mountedPage.update();
    const firstNameInput = mountedPage.find('#update-first-name');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'Maui' }
    };
    firstNameInput.simulate('change', mockEvent);
    expect(updateFirstNameSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive the input of a user\'s last name', () => {
    const mountedPage = mount(updatePageNode);
    const updateLastNameSpy = sinon.spy(mountedPage.instance(), 'updateLastName');
    mountedPage.update();
    const lastNameInput = mountedPage.find('#update-last-name');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'Mohana' }
    };
    lastNameInput.simulate('change', mockEvent);
    expect(updateLastNameSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive the input of a user\'s email', () => {
    const mountedPage = mount(updatePageNode);
    const updateUsernameSpy = sinon.spy(mountedPage.instance(), 'updateUsername');
    mountedPage.update();
    const usernameInput = mountedPage.find('#update-username');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'maui@example.com' }
    };
    usernameInput.simulate('change', mockEvent);
    expect(updateUsernameSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive the input of a user\'s password', () => {
    const mountedPage = mount(updatePageNode);
    const updatePasswordSpy = sinon.spy(mountedPage.instance(), 'updatePassword');
    mountedPage.update();
    const passwordInput = mountedPage.find('#update-password');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'sh89))_UIO' }
    };
    passwordInput.simulate('change', mockEvent);
    expect(updatePasswordSpy.calledOnce).to.equal(true);
  });

  it('should be able to auser\'s profile', () => {
    const mountedPage = mount(updatePageNode);
    const attemptProfileUpdateSpy =
      sinon.spy(mountedPage.instance(), 'attemptProfileUpdate');
    mountedPage.update();
    const profileUpdateBtn = mountedPage.find('#attempt-profile-update-btn');
    profileUpdateBtn.simulate('click');
    expect(attemptProfileUpdateSpy.calledOnce).to.equal(true);
  });

  it('should redirect non-logged in users to the homepage', () => {
    const newProps = Object.assign({}, props);
    newProps.user.isLoggedIn = false;
    const newWrapper = mount(
      <MockRouter>
        <UpdateUserPage {...newProps} />
      </MockRouter>
    );
    expect(newWrapper.find(Redirect)).to.have.length(1);
  });
});
