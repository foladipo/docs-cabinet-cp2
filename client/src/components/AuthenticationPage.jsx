import React from 'react';
import { Button, Modal } from 'react-materialize';
import LoginContainer from './LoginContainer';
import SignUpContainer from './SignUpContainer';

export default function AuthenticationPage(props) {
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
          <Modal
            header="Login"
            trigger={<Button waves="light">Login</Button>}
          >
            <LoginContainer />
          </Modal>
          <Modal
            header="Login"
            trigger={<Button waves="light">Sign up</Button>}
          >
            <SignUpContainer />
          </Modal>
        </div>
      </div>
    </div>
  );
}
