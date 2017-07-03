import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, Row } from 'react-materialize';
import isValidName from '../../../server/util/isValidName';
import isValidEmail from '../../../server/util/isValidEmail';
import isValidPassword from '../../../server/util/isValidPassword';

/**
 * UpdateUserPage - Renders a form for updating a user's profile.
 */
class UpdateUserPage extends Component {
  /**
   * Creates and initializes an instance of UpdateUserPage.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      hasFoundTargetUser: false,
      hasValidTargetUserId: false,
      hasProfileChanged: false
    };

    this.determineTargetUser = this.determineTargetUser.bind(this);
    this.showRoleUpdate = this.showRoleUpdate.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);

    this.updateRoleId = this.updateRoleId.bind(this);
    this.hasNewRoleId = this.hasNewRoleId.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.hasNewFirstName = this.hasNewFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.hasNewLastName = this.hasNewLastName.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.hasNewUsername = this.hasNewUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.hasNewPassword = this.hasNewPassword.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    this.determineTargetUser();
  }

  /**
   * Determines the target user of this update.
   * @return {null} - Returns nothing.
   */
  determineTargetUser() {
    const targetUserId = Number.parseInt(this.props.location.pathname.split('/')[3], 10);

    if (Number.isNaN(targetUserId)) {
      this.setState({
        hasValidTargetUserId: false,
        message: 'Oops! The id of the account you wish to update is not a number.'

      });
      return;
    }

    if (targetUserId === this.props.user.user.id) {
      this.setState({
        hasValidTargetUserId: true,
        targetUser: this.props.user.user,

      });
      this.setState();
      return;
    }

    const possibleTargets = this.props.user.allUsers.filter(user => user.id === targetUserId);
    const targetUser = possibleTargets[0];
    if (targetUser) {
      this.setState({
        hasValidTargetUserId: true,
        targetUser
      });
      return;
    }

    // TODO: Try to fetch the target user instead.
    this.state = {
      hasValidTargetUserId: true,
      hasFoundTargetUser: false
    };
  }

  /**
   * Called called to show the role update field if this updater is an admin
   * AND is not updating his/her own account.
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  showRoleUpdate() {
    if (this.props.user.user.roleId > 0 && this.state.targetUser.id !== this.props.user.user.id) {
      return (
        <Input
          s={12}
          type="select"
          label="Account type"
          defaultValue={this.state.targetUser.roleId}
          onChange={this.updateRoleId}
        >
          <option value="0">Regular</option>
          <option value="1">Admin</option>
        </Input>
      );
    }
  }

  /**
   * Updates the roleId stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateRoleId(event) {
    event.preventDefault();
    const newRoleId = Number.parseInt(event.target.value, 10);
    this.setState({ newRoleId });
  }

  /**
   * Determines whether or not the roleId stored in this Component's state IS an update.
   * @return {Boolean} - Returns true if the roleId stored in this Component's state,
   * IS an update, and false if otherwise.
   */
  hasNewRoleId() {
    return this.state.newRoleId && this.state.newRoleId !== this.state.targetUser.roleId;
  }

  /**
   * Updates the firstName stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateFirstName(event) {
    event.preventDefault();
    this.setState({ newFirstName: event.target.value });
  }

  /**
   * Determines whether or not the firstName stored in this Component's state IS an update.
   * @return {Boolean} - Returns true if the firstName stored in this Component's state,
   * IS an update, and false if otherwise.
   */
  hasNewFirstName() {
    if (!this.state.newFirstName) return false;

    return (
      this.state.newFirstName !== this.state.targetUser.firstName &&
      isValidName(this.state.newFirstName)
    );
  }

  /**
   * Updates the lastName stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateLastName(event) {
    event.preventDefault();
    this.setState({ newLastName: event.target.value });
  }

  /**
   * Determines whether or not the lastName stored in this Component's state IS an update.
   * @return {Boolean} - Returns true if the lastName stored in this Component's state,
   * IS an update, and false if otherwise.
   */
  hasNewLastName() {
    if (!this.state.newLastName) return false;

    return (
      this.state.newLastName !== this.state.targetUser.lastName &&
      isValidName(this.state.newLastName)
    );
  }

  /**
   * Updates the username stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateUsername(event) {
    event.preventDefault();
    this.setState({ newUsername: event.target.value });
  }

  /**
   * Determines whether or not the username stored in this Component's state IS an update.
   * @return {Boolean} - Returns true if the username stored in this Component's state,
   * IS an update, and false if otherwise.
   */
  hasNewUsername() {
    if (!this.state.newUsername) return false;

    return (
      this.state.newUsername !== this.state.targetUser.username &&
      isValidEmail(this.state.newUsername)
    );
  }

  /**
   * Updates the password stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updatePassword(event) {
    event.preventDefault();
    this.setState({ newPassword: event.target.value });
  }

  /**
   * Determines whether or not the password stored in this Component's state IS an update.
   * @return {Boolean} - Returns true if the password stored in this Component's state,
   * IS an update, and false if otherwise.
   */
  hasNewPassword() {
    return this.state.newPassword && isValidPassword(this.state.newPassword);
  }

  /**
   * Attempts to update a user's profile.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptProfileUpdate(event) {
    event.preventDefault();

    let newProfile = {};
    if (this.hasNewFirstName()) newProfile.firstName = this.state.newFirstName;
    if (this.hasNewLastName()) newProfile.lastName = this.state.newLastName;
    if (this.hasNewUsername()) newProfile.username = this.state.newUsername;
    if (this.hasNewPassword()) newProfile.password = this.state.newPassword;

    // TODO: Dispatch an update action using this user's token and newProfile.
  }

  /**
   * Called to show the profile update form if the target user has been determined.
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  showUpdateForm() {
    const isUpdate = () => (
      this.hasNewRoleId() ||
      this.hasNewFirstName() ||
      this.hasNewLastName() ||
      this.hasNewUsername() ||
      this.hasNewPassword()
    );

    if (this.state.targetUser) {
      return (
        <div className="container">
          <div>
            <h3>Update profile</h3>
            <div className="divider" />
            <form>
              {this.showRoleUpdate()}
              <Row>
                <Input
                  s={6}
                  label="First Name"
                  defaultValue={this.state.targetUser.firstName}
                  onChange={this.updateFirstName}
                >
                  <Icon>face</Icon>
                </Input>
                <Input
                  s={6}
                  label="Last Name"
                  defaultValue={this.state.targetUser.lastName}
                  onChange={this.updateLastName}
                >
                  <Icon>face</Icon>
                </Input>
                <Input
                  type="email"
                  label="Email"
                  s={12}
                  defaultValue={this.state.targetUser.username}
                  onChange={this.updateUsername}
                >
                  <Icon>account_circle</Icon>
                </Input>
                {/* TODO: Add a tooltip with info about acceptable passwords. */}
                <Input type="password" label="Password" s={12} onChange={this.updatePassword}>
                  <Icon>lock</Icon>
                </Input>
                <Button
                  className={isUpdate() ? 'hoverable' : 'disabled'}
                  waves="light"
                >
                  Update
                  <Icon left>update</Icon>
                </Button>
              </Row>
            </form>
          </div>
          <div className="divider" />
          <div>
            <h3 className="red-text">Danger zone</h3>
            <div className="divider" />
            <div className="delete-user-section red-border all-corners-rounded">
              <h5>Delete account</h5>
              <p>
                You&rsquo;re about to delete this account. If
                you continue, this account and the documents that
                belong to it will be gone forever.
              </p>
              <Button className="red white-text hoverable" waves="light">
                Delete account
                <Icon left>delete</Icon>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h3>
          :( We don&rsquo;t know which account you want to update.
        </h3>
      </div>
    );
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    return (
      <div className="scrollable-page update-user-page">
        {this.showUpdateForm()}
      </div>
    );
  }
}

UpdateUserPage.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default UpdateUserPage;
