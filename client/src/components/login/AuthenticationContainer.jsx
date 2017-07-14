import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LoginContainer from './LoginContainer';
import SignUpContainer from './SignUpContainer';

/**
 * AuthenticationContainer - Renders an authentication page for a user
 * to either sign up or login.
 * @param {Object} props - The data passed to this component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
function AuthenticationContainer(props) {
  if (props.user.isLoggedIn) {
    $('#loginModal').modal('close');
    $('#signUpModal').modal('close');
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="auth-page valign-wrapper full-height">
      <div className="container">
        <div className="container section three-quarters-height">
          <div className="section z-depth-4 white">
            <h3 className="center">Welcome to Docs Cabinet!</h3>
            <div className="horizontally-centered quarter-side-margin wraps-content">
              <Modal
                id="signUpModal"
                header="Sign up"
                trigger={
                  <Button
                    waves="light"
                    className="quarter-side-margin teal lighten-1"
                  >
                    Sign up
                  </Button>
                }
              >
                <SignUpContainer />
              </Modal>
              <Modal
                id="loginModal"
                header="Login"
                trigger={
                  <Button
                    id="login-btn"
                    waves="light"
                    className="quarter-side-margin teal lighten-5 black-text"
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
    </div>
  );
}

const mapStateToProps = storeState => ({
  user: storeState.user
});

AuthenticationContainer.propTypes = {
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default connect(mapStateToProps)(AuthenticationContainer);
