import React from 'react';
import { Button, Modal } from 'react-materialize';
import LoginContainer from './LoginContainer';
import SignUpContainer from './SignUpContainer';

/**
 * AuthenticationPage - Renders an authentication page for a user
 * to either sign up or login.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
export default function AuthenticationPage() {
  const isLoggedIn = () => {
    let isUserLoggedIn = false;
    const token = window.localStorage.getItem('token');
    if (token !== '' && token !== null) {
      isUserLoggedIn = true;
    }
    return isUserLoggedIn;
  };
  if (isLoggedIn()) {
    window.location.replace('/dashboard');
    return null;
  }

  return (
    <div className={'container valign-wrapper full-height'}>
      <div className="container section three-quarters-height">
        <div className="section z-depth-4 white">
          <h3 className="center">Welcome to Docs Cabinet!</h3>
          <div className="horizontally-centered quarter-side-margin wraps-content">
            <Modal
              header="Sign up"
              trigger={
                <Button
                  waves="light"
                  className="quarter-side-margin cyan darken-2"
                >
                  Sign up
                </Button>
              }
            >
              <SignUpContainer />
            </Modal>
            <Modal
              header="Login"
              trigger={
                <Button
                  waves="light"
                  className="quarter-side-margin cyan lighten-5 black-text"
                >Login
                </Button>
              }
            >
              <LoginContainer />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
