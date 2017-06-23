import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Input, Icon, Button, Col, ProgressBar } from 'react-materialize';
import { signUp } from '../actions/UserActions';

/**
 * SignUpContainer - Renders the sign up form.
 */
class SignUpContainer extends React.Component {
  /**
   * Creates and initializes an instance of SignUpContainer.
   * @param {Object} props - The data passed to this component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      password: ''
    };

    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.attemptSignUp = this.attemptSignUp.bind(this);
  }

  /**
   * Updates the value of firstName in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateFirstName(event) {
    event.preventDefault();
    this.setState({
      firstName: event.target.value
    });
  }

  /**
   * Updates the value of lastName in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateLastName(event) {
    event.preventDefault();
    this.setState({
      lastName: event.target.value
    });
  }

  /**
   * Updates the value of username in this Component's state.
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
   * Updates the value of password in this Component's state.
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
   * Attempts to create a new account using the supplied credentials.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptSignUp(event) {
    // TODO: Validate form input here and, if appropriate, show an error.
    event.preventDefault();
    this.props.dispatch(signUp(
      this.state.firstName,
      this.state.lastName,
      this.state.username,
      this.state.password
    ));
  }

  // TODO: Consult: Should this be here? Or in the Actions file?
  /**
   * Returns a simplified error message for failed sign up attempts.
   * @return {String} - A simplified error message.
   */
  simpleErrorMessage() {
    const technicalError = this.props.user.signUpError;
    let simplifiedError;
    switch (technicalError) {
      case 'InvalidFirstNameError':
      case 'MissingFirstNameError':
      case 'EmptyFirstNameError':
        simplifiedError = 'Please enter a first name that has two or more letters (no whitespace please).';
        break;

      case 'InvalidLastNameError':
      case 'MissingLastNameError':
      case 'EmptyLastNameError':
        simplifiedError = 'Please enter last name that has two or more letters (no whitespace please).';
        break;

      case 'InvalidUsernameError':
      case 'MissingUsernameError':
      case 'EmptyUsernameError':
        simplifiedError = 'Please enter a valid email address in the form below.';
        break;


      case 'MissingPasswordError':
      case 'EmptyPasswordError':
        simplifiedError = 'Please enter a strong password in the form below.';
        break;

      case 'InvalidPasswordError':
        simplifiedError = 'Oops, that password isn\'t good enough. Use something stronger.';
        break;

      case 'UserExistsError':
        simplifiedError = 'This username is taken. Use another one or log in.';
        break;

      default:
        simplifiedError = '';
    }

    return simplifiedError;
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    return (
      <div>
        <h6 className="red-text text-lighten-2">**All fields are required.</h6>
        <form>
          <div className="red lighten-2">
            <p className="white-text center">
              {this.simpleErrorMessage()}
            </p>
          </div>
          <Row>
            <Input s={6} label="First Name" onChange={this.updateFirstName}>
              <Icon>face</Icon>
            </Input>
            <Input s={6} label="Last Name" onChange={this.updateLastName}>
              <Icon>face</Icon>
            </Input>
            <Input
              s={12}
              label="Email"
              type="email"
              validate
              onChange={this.updateUsername}
            >
              <Icon>account_circle</Icon>
            </Input>
            <div className="red-text text-lighten-2">
              <p>**An acceptable password must at least contain one
                uppercase letter, one lower case letter, a number
                and a symbol (e.g $, *, #, @ etc).
              </p>
            </div>
            <Input s={12} label="Password" type="password" onChange={this.updatePassword}>
              <Icon>lock</Icon>
            </Input>
            <Button
              className={this.props.user.isLoggingIn ? 'disabled pulse' : 'pulse'}
              waves="light"
              onClick={this.attemptSignUp}
            >
              Sign up
              <Icon left>send</Icon>
            </Button>
          </Row>
        </form>
        <Col s={12} className={this.props.user.isLoggingIn ? '' : 'hide'}>
          <ProgressBar />
        </Col>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  user: storeState.user
});

SignUpContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any)
};

SignUpContainer.defaultProps = {
  user: {}
};

export default connect(mapStateToProps)(SignUpContainer);
