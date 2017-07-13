import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Input, Icon, Button, Col, ProgressBar } from 'react-materialize';
import { signUp } from '../../actions/UserActions';

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
              {this.props.user.statusMessage}
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
              className={this.props.user.isLoggingIn ? 'disabled' : ''}
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
