import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import { Button } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import MockRouter from 'react-mock-router';
import { AuthenticationContainer } from '../../../components/login/AuthenticationContainer';

chai.use(chaiEnzyme());
const expect = chai.expect;

const props = {
  dispatch: () => {},
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
const wrapper = mount(<AuthenticationContainer {...props} />);

describe('AuthenticationContainer', () => {
  it('should have an HTML id of authentication-container', () => {
    expect(wrapper).to.have.id('authentication-container');
  });

  it('should show a welcome message to users', () => {
    expect(wrapper.find('.welcome-msg')).to.have.length(1);
  });

  it('should show buttons for both signing up and logging in', () => {
    expect(wrapper.find(Button)).to.have.length(2);
  });

  it('should redirect to the dashboard after a user signs up/logs in', () => {
    const newProps = Object.assign({}, props);
    newProps.user.isLoggedIn = true;
    const newWrapper = mount(
      <MockRouter>
        <AuthenticationContainer {...newProps} />
      </MockRouter>
    );
    expect(newWrapper.find(Redirect)).to.have.length(1);
  });
});
