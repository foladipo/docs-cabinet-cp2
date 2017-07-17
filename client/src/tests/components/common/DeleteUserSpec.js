import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import DeleteUser from '../../../components/common/DeleteUser';

chai.use(chaiEnzyme());
const expect = chai.expect;

const spy = sinon.spy();

const props = {
  dispatch: spy,
  user: {
    isLoggedIn: true,
    isLoggingIn: false,
    isLoggingOut: false,
    token: 'RANDOM_TOKEN',
    user: {},
    allUsersCount: 0,
    allUsers: {
      users: [],
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
  targetUser: {
    username: 'doomedUser@example.com'
  }
};

const wrapper = mount(<DeleteUser {...props} />);

describe('DeleteUser', () => {
  it('should have an HTML id of delete-user-form', () => {
    expect(wrapper).to.have.id('delete-user-form');
  });

  it('should show a warning before deleting an account', () => {
    expect(wrapper.find('.delete-user-warning')).to.have.length(1);
  });

  it('should ask a user to confirm the deletion', () => {
    expect(wrapper.find('.confirm-deletion-msg')).to.have.length(1);
  });

  it('should confirm the deletion by asking for the target user\'s email', () => {
    const updateTargetUsernameSpy = sinon.spy(wrapper.instance(), 'updateTargetUsername');
    wrapper.update();
    const confirmUserEmail = wrapper.find('#confirm-deletion-input');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'doomedUser@example.com' }
    };
    confirmUserEmail.simulate('change', mockEvent);
    expect(updateTargetUsernameSpy.calledOnce).to.equal(true);
  });

  it('should have a button for deleting a user', () => {
    expect(wrapper.find('#delete-user-btn')).to.have.length(1);
  });

  it('should enable the delete button once a user confirms the deletion', () => {
    wrapper.setState({ targetUsername: props.targetUser.username });
    expect(wrapper.find('#delete-user-btn')).to.not.have.className('disabled');
  });

  it('should be able to delete a user', () => {
    wrapper.setState({ targetUsername: props.targetUser.username });
    const confirmBtn = wrapper.find('#delete-user-btn');
    confirmBtn.simulate('click');
    expect(spy.calledOnce).to.equal(true);
  });
});
