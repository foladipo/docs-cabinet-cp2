import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, ProgressBar, Row } from 'react-materialize';
import * as UserActions from '../../actions/UserActions';

/**
 * LoginForm - Renders the login form.
 */
class LoginForm extends React.Component {
  /**
   * Creates and initializes an instance of LoginForm.
   * @param {Object} props - The data passed to this component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.attemptLogin = this.attemptLogin.bind(this);
  }

  /**
   * Updates the value of username stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateUsername(event) {
    event.preventDefault();
    this.setState({
      username: event.target.value
    });
  }

  /**
   * Updates the value of password stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updatePassword(event) {
    event.preventDefault();
    this.setState({
      password: event.target.value
    });
  }

  /**
   * Attempts to log a user in using the supplied credentials.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptLogin(event) {
    // TODO: Validate form input here and, if appropriate, show an error
    event.preventDefault();
    this.props.dispatch(
      UserActions.login(this.state.username, this.state.password)
    );
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    return (
      <div id="login-form">
        <h6 className="red-text text-lighten-2">**All fields are required.</h6>
        <form>
          <div
            className={
              this.props.user.status === 'loginFailed' ?
              'msg-container red lighten-2' :
              'hide msg-container red lighten-2'
            }
          >
            <p className="error-msg white-text center">
              {this.props.user.statusMessage}
            </p>
          </div>
          <Row>
            <Input
              id="update-username"
              name="email"
              s={12}
              type="email"
              label="Email"
              onChange={this.updateUsername}
              defaultValue=""
              validate
            >
              <Icon>account_circle</Icon>
            </Input>
            <Input
              id="update-password"
              name="password"
              s={12}
              type="password"
              label="Password"
              onChange={this.updatePassword}
              validate
            >
              <Icon>lock</Icon>
            </Input>
            <Button
              id="login-btn"
              className={this.props.user.isLoggingIn ? 'disabled' : ''}
              waves="light"
              onClick={this.attemptLogin}
            >
              Login
              <Icon left>send</Icon>
            </Button>
          </Row>
        </form>
        <div
          s={12}
          className={
            this.props.user.isLoggingIn ?
            'progress-bar-container' :
            'hide progress-bar-container'
          }
        >
          <ProgressBar />
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default LoginForm;
