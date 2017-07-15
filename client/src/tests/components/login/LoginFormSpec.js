import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { Button } from 'react-materialize';
import sinon from 'sinon';
import LoginForm from '../../../components/login/LoginForm';

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
const wrapper = mount(<LoginForm {...props} />);

describe('LoginForm', () => {
  it('should have an HTML id of login-form', () => {
    expect(wrapper).to.have.id('login-form');
  });

  it('should have a section for showing messages to users', () => {
    expect(wrapper.find('.msg-container.hide')).to.have.length(1);
  });

  it('should show a button for logging in', () => {
    expect(wrapper.find(Button)).to.have.length(1);
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

  it('should be able to login a user', () => {
    const attemptLoginSpy =
      sinon.spy(wrapper.instance(), 'attemptLogin');
    wrapper.update();
    const loginBtn = wrapper.find('#login-btn');
    loginBtn.simulate('click');
    expect(attemptLoginSpy.calledOnce).to.equal(true);
    expect(dispatchSpy.calledOnce).to.equal(true);
  });

  it('should show an error message for failed logins', () => {
    wrapper.setProps(
      {
        user: {
          status: 'loginFailed',
          statusMessage: 'We don\'t remember you. Please try again or sign up.'
        }
      }
    );
    expect(wrapper.find('.msg-container.hide')).to.have.length(0);
  });

  it('should disable the log in button and show a progress bar while logging in', () => {
    wrapper.setProps(
      {
        user: {
          isLoggingIn: true
        }
      }
    );
    expect(wrapper.find('#login-btn')).to.have.className('disabled');
    expect(wrapper.find('.progress-bar-container')).to.not.have.className('hide');
  });
});
