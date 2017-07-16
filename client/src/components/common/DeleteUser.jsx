import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, ProgressBar } from 'react-materialize';
import { deleteUser } from '../../actions/UserActions';

/**
 * DeleteUser - Renders a form for deleting a user's account.
 */
class DeleteUser extends Component {
  /**
   * Creates and initializes an instance of DeleteUser.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {};

    this.updateTargetUsername = this.updateTargetUsername.bind(this);
    this.hasConfirmedDeletion = this.hasConfirmedDeletion.bind(this);
    this.attemptToDeleteUser = this.attemptToDeleteUser.bind(this);
  }

  /**
   * Updates the username of the account which is to be deleted, which
   * is stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateTargetUsername(event) {
    event.preventDefault();

    this.setState({ targetUsername: event.target.value });
  }

  /**
   * Determines whether or not the user deleting an account has confirmed
   * that he/she REALLY wants to do so.
   * @return {Boolean} - Returns true if the account deletion has been
   * confirmed, and false if otherwise.
   */
  hasConfirmedDeletion() {
    if (
      this.state.targetUsername &&
      this.state.targetUsername === this.props.targetUser.username
    ) {
      return true;
    }
    return false;
  }

  /**
   * Attempts to delete an account.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptToDeleteUser(event) {
    event.preventDefault();

    if (!this.hasConfirmedDeletion()) {
      return;
    }

    this.props.dispatch(
      deleteUser(this.props.user.token, this.props.targetUser.id)
    );
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    return (
      <div id="delete-user-form">
        <h5
          className={this.props.user.status === 'userDeletionFailed' ? 'red lighten-2 white-text center-align' : 'hide'}
        >
          {this.props.user.statusMessage}
        </h5>
        <p className="delete-user-warning">
          Are you sure? This action is <b className="red-text">NOT</b>
          &nbsp;reversible. All the data about and documents owned by this
          account will be lost forever.
        </p>
        <p className="confirm-deletion-msg">
          Type&nbsp;
          <b className="white red-text">
            {this.props.targetUser.username}
          </b>&nbsp;
          in the field below if you&rsquo;re sure you want to delete&nbsp;
          this account.
        </p>
        <div>
          <form>
            <Input
              id="confirm-deletion-input"
              type="text"
              label="Username"
              onChange={this.updateTargetUsername}
            >
              <Icon>delete</Icon>
            </Input>
            <Button
              id="delete-user-btn"
              className={this.hasConfirmedDeletion() ? 'red white-text' : 'disabled'}
              onClick={this.attemptToDeleteUser}
            >
              Delete
            </Button>
          </form>
          <ProgressBar className={this.props.user.status === 'deletingUser' ? '' : 'hide'} />
        </div>
      </div>
    );
  }
}

DeleteUser.propTypes = {
  dispatch: PropTypes.func.isRequired,
  targetUser: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default DeleteUser;
