import React from 'react';
import { connect } from 'react-redux';
import * as UserActions from '../actions/UserActions';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);

    this.username = '';
    this.password = '';
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.login = this.login.bind(this);
  }

  componentWillMount() {
    if (this.isLoggedIn()) {
      window.location.replace('/dashboard');
    }
  }

  isLoggedIn() {
    let isLoggedIn = false;
    const token = window.localStorage.getItem('token');
    if (token !== '' && token !== null) {
      isLoggedIn = true;
    }
    return isLoggedIn;
  }

  updateUsername(event) {
    event.preventDefault();
    this.username = event.target.value;
  }

  updatePassword(event) {
    event.preventDefault();
    this.password = event.target.value;
  }

  login(event) {
    event.preventDefault();
    this.props.dispatch(UserActions.login(this.username, this.password));
  }

  render() {
    const user = JSON.stringify(this.props.user.user);
    return (
      <div>
        <h1>This is the login component.</h1>
        <h2>Token is</h2>
        <h3>{this.props.user.token}</h3>
        <h2>User is</h2>
        <h3>{user}</h3>
        <h2>Error is</h2>
        <h3>{this.props.user.error}</h3>
        <form>
          <input type="text" placeholder="Username" onChange={this.updateUsername} />
          <input type="password" placeholder="Password" onChange={this.updatePassword} />
          <button onClick={this.login}>Login</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  user: storeState.user
});

export default connect(mapStateToProps)(LoginContainer);
