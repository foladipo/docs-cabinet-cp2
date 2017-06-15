import React from 'react';
import { connect } from 'react-redux';
import { Row, Input, Icon, Button } from 'react-materialize';
import { signUp } from '../actions/UserActions';

function SignUpContainer(props) {
  let firstName;
  let lastName;
  let username;
  let password;

  const updateFirstName = (event, value) => {
    event.preventDefault();
    firstName = value;
  };
  const updateLastName = (event, value) => {
    event.preventDefault();
    lastName = value;
  };
  const updateUsername = (event, value) => {
    event.preventDefault();
    username = value;
  };
  const updatePassword = (event, value) => {
    event.preventDefault();
    password = value;
  };

  const attemptSignUp = (event) => {
    // TODO: Validate form input here and, if appropriate, show an error
    // message in a toast.
    event.preventDefault();
    props.dispatch(signUp(firstName, lastName, username, password));
  };

  return (
    <div>
      <form>
        <Row>
          <Input s={6} label="First Name" onChange={updateFirstName}>
            <Icon>face</Icon>
          </Input>
          <Input s={6} label="Last Name" onChange={updateLastName}>
            <Icon>face</Icon>
          </Input>
          <Input s={12} label="Email" type="email" validate onChange={updateUsername}>
            <Icon>account_circle</Icon>
          </Input>
          <Input s={12} label="Password" type="password" onChange={updatePassword}>
            <Icon>lock</Icon>
          </Input>
          <Button waves="light" onClick={attemptSignUp}>
            Sign up
            <Icon left>send</Icon>
          </Button>
        </Row>
      </form>
    </div>
  );
}

const mapStateToProps = storeState => ({
  user: storeState.user
});

export default connect(mapStateToProps)(SignUpContainer);
