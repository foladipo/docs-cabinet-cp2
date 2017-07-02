import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Preloader } from 'react-materialize';
import { fetchAllUsers } from '../actions/UserActions';
import User from './User';

// TODO: Add infinite scrolling.

/**
 * UsersPage - Renders a list of users.
 */
class UsersPage extends Component {
  /**
   * Creates and initializes an instance of UsersPage.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = { limit: 30, offset: 0 };
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    if (this.props.user.allUsers.length < 1) {
      this.props.dispatch(fetchAllUsers(
        this.props.user.token,
        this.state.limit,
        this.state.offset
      ));
    }
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    let users;
    if (this.props.user.allUsers) {
      users = this.props.user.allUsers.map(user => <User key={uuid.v4()} {...user} />);
    }

    return (
      <div className="users-page">
        <h3
          className={this.props.user.status === 'fetchedAllUsers' && this.props.user.allUsers.length < 1 ? '' : 'hide'}
        >
          {this.props.user.statusMessage}
        </h3>
        <div className="users-page-users-container row">
          {users}
        </div>
        <div
          className={
            this.props.user.status === 'fetchingAllUsers' ||
            this.props.user.status === 'fetchAllUsersFailed' ? '' : 'hide'
          }
        >
          <h3>{this.props.user.statusMessage}</h3>
          <div className={this.props.user.status === 'fetchingAllUsers' ? '' : 'hide'}>
            <Preloader flashing className="center-align" />
          </div>
        </div>
      </div>
    );
  }
}

UsersPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default UsersPage;
