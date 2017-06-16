import React from 'react';
import { connect } from 'react-redux';
import { Row, Input, Button, Icon } from 'react-materialize';
import * as UserActions from '../actions/UserActions';

function LoginContainer(props) {
  let username = '';
  let password = '';
  const updateUsername = (event) => {
    event.preventDefault();
    username = event.target.value;
  };

  const updatePassword = (event) => {
    event.preventDefault();
    password = event.target.value;
  };

  const login = (event) => {
    event.preventDefault();
    props.dispatch(UserActions.login(username, password));
  };

  return (
    <div>
      <form>
        <Row>
          <Row>
            <Input
              s={12}
              type="email"
              label="Email"
              onChange={updateUsername}
              defaultValue=""
              validate
            >
              <Icon>account_circle</Icon>
            </Input>
            <Input
              s={12}
              type="password"
              label="Password"
              onChange={updatePassword}
              validate
            >
              <Icon>lock</Icon>
            </Input>
            <Button waves="light" onClick={login}>
              Login
              <Icon left>send</Icon>
            </Button>
          </Row>
        </Row>
      </form>
    </div>
  );
}

const mapStateToProps = storeState => ({
  user: storeState.user
});

export default connect(mapStateToProps)(LoginContainer);
