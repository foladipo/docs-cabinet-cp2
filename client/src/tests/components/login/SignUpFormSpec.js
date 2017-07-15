import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { Button } from 'react-materialize';
import sinon from 'sinon';
import SignUpForm from '../../../components/login/SignUpForm';

chai.use(chaiEnzyme());
const expect = chai.expect;

const dispatchSpy = sinon.spy();
const props = {
  dispatch: dispatchSpy,
  user: {
    isLoggedIn: false,
    isLoggingIn: false,
    isLoggingOut: false,
    token: null,
    user: {},
    status: '',
    statusMessage: ''
  }
};
const wrapper = mount(<SignUpForm {...props} />);

describe('SignUpForm', () => {
  it('should have an HTML id of sign-up-form', () => {
    expect(wrapper).to.have.id('sign-up-form');
  });

  it('should have a section for showing messages to users', () => {
    expect(wrapper.find('.msg-container.hide')).to.have.length(1);
  });

  it('should show a button for signing up', () => {
    expect(wrapper.find(Button)).to.have.length(1);
  });

  it('should be able to receive the input of a user\'s first name', () => {
    const updateFirstNameSpy = sinon.spy(wrapper.instance(), 'updateFirstName');
    wrapper.update();
    const firstNameInput = wrapper.find('#update-first-name');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'Maui' }
    };
    firstNameInput.simulate('change', mockEvent);
    expect(updateFirstNameSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive the input of a user\'s last name', () => {
    const updateLastNameSpy = sinon.spy(wrapper.instance(), 'updateLastName');
    wrapper.update();
    const lastNameInput = wrapper.find('#update-last-name');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'Mohana' }
    };
    lastNameInput.simulate('change', mockEvent);
    expect(updateLastNameSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive the input of a user\'s email', () => {
    const updateUsernameSpy = sinon.spy(wrapper.instance(), 'updateUsername');
    wrapper.update();
    const usernameInput = wrapper.find('#update-username');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'maui@example.com' }
    };
    usernameInput.simulate('change', mockEvent);
    expect(updateUsernameSpy.calledOnce).to.equal(true);
  });

  it('should be able to receive the input of a user\'s password', () => {
    const updatePasswordSpy = sinon.spy(wrapper.instance(), 'updatePassword');
    wrapper.update();
    const passwordInput = wrapper.find('#update-password');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'sh89))_UIO' }
    };
    passwordInput.simulate('change', mockEvent);
    expect(updatePasswordSpy.calledOnce).to.equal(true);
  });

  it('should be able to sign up a new user', () => {
    const attemptSignUpSpy =
      sinon.spy(wrapper.instance(), 'attemptSignUp');
    wrapper.update();
    const signUpBtn = wrapper.find('#sign-up-btn');
    signUpBtn.simulate('click');
    expect(attemptSignUpSpy.calledOnce).to.equal(true);
    expect(dispatchSpy.calledOnce).to.equal(true);
  });

  it('should show an error message for failed sign ups', () => {
    wrapper.setProps(
      {
        user: {
          status: 'signUpFailed',
          statusMessage: 'Oops! That email is taken.'
        }
      }
    );
    expect(wrapper.find('.msg-container.hide')).to.have.length(0);
  });

  it('should disable the sign up button and show a progress bar while signing up', () => {
    wrapper.setProps(
      {
        user: {
          isLoggingIn: true
        }
      }
    );
    expect(wrapper.find('#sign-up-btn')).to.have.className('disabled');
    expect(wrapper.find('.progress-bar-container')).to.not.have.className('hide');
  });
});
