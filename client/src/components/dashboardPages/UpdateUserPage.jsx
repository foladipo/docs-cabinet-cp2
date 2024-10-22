import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Icon, Input, Modal, ProgressBar, Row } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';
import DeleteUser from '../common/DeleteUser';
import isValidName from '../../../../server/util/isValidName';
import isValidEmail from '../../../../server/util/isValidEmail';
import isValidPassword from '../../../../server/util/isValidPassword';
import { getUser, updateUser } from '../../actions/UserActions';

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
      targetUser: {}
    };

    this.determineTargetUser = this.determineTargetUser.bind(this);
    this.showRoleUpdate = this.showRoleUpdate.bind(this);
    this.showDeleteAccountSection = this.showDeleteAccountSection.bind(this);
    this.showUpdateForm = this.showUpdateForm.bind(this);
    this.attemptProfileUpdate = this.attemptProfileUpdate.bind(this);
    this.isUpdate = this.isUpdate.bind(this);

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
   * Called immediately before rendering, when new props are or
   * state is being received.
   * @param {Object} nextProps - The new props this Component
   * will receive when re-rendered.
   * @return {null} - Returns nothing.
   */
  componentWillReceiveProps(nextProps) {
    const oldTargetUserId = Number.parseInt(this.props.location.pathname.split('/')[3], 10);
    const newTargetUserId = Number.parseInt(nextProps.location.pathname.split('/')[3], 10);
    if (oldTargetUserId !== newTargetUserId) {
      this.determineTargetUser();
      return;
    }

    if (nextProps.user.status === 'updatedUser') {
      let targetUser;
      if (this.state.targetUser.id === nextProps.user.user.id) {
        targetUser = nextProps.user.user;
      }
      if (targetUser === undefined) {
        const targetUserInArray = nextProps.user.allUsers.users.filter(user =>
          user.id === this.state.targetUser.id
        );
        targetUser = targetUserInArray[0];
      }

      if (targetUser !== undefined) {
        this.setState({
          targetUser,
          newFirstName: targetUser.firstName,
          newLastName: targetUser.lastName,
          newUsername: targetUser.username,
          newRoleId: targetUser.roleId,
        });

        return;
      }

      this.determineTargetUser();
      return;
    }

    if (nextProps.user.status === 'gotUser') {
      const targetUser = nextProps.user.userToUpdate;
      if (!(_.isEqual({}, targetUser))) {
        this.setState({
          targetUser
        });
      }
      this.forceUpdate();
    }
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
        targetUser: this.props.user.user
      });
      return;
    }

    const possibleTargets = this.props.user.allUsers.users.filter(user =>
      user.id === targetUserId
    );
    const targetUser = possibleTargets[0];
    if (targetUser) {
      this.setState({
        hasValidTargetUserId: true,
        targetUser
      });
      return;
    }

    this.props.dispatch(
      getUser(this.props.user.token, targetUserId)
    );
  }

  /**
   * Called called to show the role update field if this updater is an admin
   * AND is not updating his/her own account.
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  showRoleUpdate() {
    if (
      this.props.user.user.roleId > 0 &&
      this.state.targetUser.id !== this.props.user.user.id
    ) {
      return (
        <Col s={12} m={6}>
          <span className="green-label">Account type</span>
          <Input
            id="update-role-id"
            s={12}
            type="select"
            defaultValue={this.state.targetUser.roleId}
            onChange={this.updateRoleId}
          >
            <option value="0">Regular</option>
            <option value="1">Admin</option>
          </Input>
        </Col>
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
   * Determines whether or not the roleId stored in this Component's
   * state IS an update.
   * @return {Boolean} - Returns true if the roleId stored in this
   * Component's state,
   * IS an update, and false if otherwise.
   */
  hasNewRoleId() {
    // Trust me, it is required to compare to undefined. Coz when
    // this.state.newRoleId is a number, the code below returns a number,
    // not a Boolean.
    return (
      this.state.newRoleId !== undefined &&
      this.state.newRoleId !== this.state.targetUser.roleId
    );
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
   * Determines whether or not the firstName stored in this Component's state
   * IS an update.
   * @return {Boolean} - Returns true if the firstName stored in this
   * Component's state,
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
   * Determines whether or not the lastName stored in this Component's
   * state IS an update.
   * @return {Boolean} - Returns true if the lastName stored in this
   * Component's state,
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
   * Determines whether or not the username stored in this Component's
   * state IS an update.
   * @return {Boolean} - Returns true if the username stored in this
   * Component's state,
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
   * Determines whether or not the password stored in this Component's
   * state IS an update.
   * @return {Boolean} - Returns true if the password stored in this
   * Component's state,
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

    const newProfile = {};
    if (this.hasNewFirstName()) newProfile.firstName = this.state.newFirstName;
    if (this.hasNewLastName()) newProfile.lastName = this.state.newLastName;
    if (this.hasNewUsername()) newProfile.username = this.state.newUsername;
    if (this.hasNewPassword()) newProfile.password = this.state.newPassword;
    if (this.hasNewRoleId()) newProfile.roleId = this.state.newRoleId;

    this.props.dispatch(updateUser(
      this.props.user.token,
      this.state.targetUser.id,
      newProfile
    ));
  }

  /**
   * Called to show the "delete account" section if the target user has
   * been determined. Note that it prevents admin users from deleting their
   * own accounts.
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  showDeleteAccountSection() {
    if (this.state.targetUser) {
      if (
        (this.props.user.user.roleId < 1) ||
        (
          this.props.user.user.roleId > 0 &&
          this.state.targetUser.id !== this.props.user.user.id
        )
      ) {
        return (
          <div id="delete-account-section">
            <h3 className="red-text">Danger zone</h3>
            <div className="divider" />
            <div className="delete-user-section red-border all-corners-rounded">
              <h5>Delete account</h5>
              <p>
                You&rsquo;re about to delete this account. If
                you continue, this account and the documents that
                belong to it will be gone forever.
              </p>
              <Modal
                id="delete-user-modal"
                header="Delete account"
                trigger={
                  <Button
                    id="delete-user-form-btn"
                    className="red white-text hoverable"
                    waves="light"
                  >
                    Delete account
                    <Icon left>delete</Icon>
                  </Button>
                }
              >
                <DeleteUser
                  targetUser={this.state.targetUser}
                  {...this.props}
                />
              </Modal>
            </div>
          </div>
        );
      }
    }
  }

  /**
   * Checks whether or not any part of a user's profile (username,
   * lastname etc) has changed.
   * @return {Boolean} - Returns true if any part of a user profile has
   * changed, and false if otherwise.
   */
  isUpdate() {
    if (this.hasNewRoleId()) return true;
    if (this.hasNewFirstName()) return true;
    if (this.hasNewLastName()) return true;
    if (this.hasNewUsername()) return true;
    if (this.hasNewPassword()) return true;

    return false;
  }

  /**
   * Called to show the profile update form if the target user has been
   * determined.
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  showUpdateForm() {
    const firstNameTooltip = 'Please enter a new first name that has two or more non-whitespace characters.';
    const lastNameTooltip = 'Please enter a new last name that has two or more non-whitespace characters.';
    const userNameTooltip = 'Please enter your new email address.';
    const passwordTootip = 'An acceptable password must be at least eight characters long and contain one uppercase letter, one lower case letter, a number and a symbol (e.g $, *, #, @ etc).';

    if (this.state.targetUser) {
      return (
        <div className="centered-wrapper">
          <div className="msg-container center-align white-text">
            <h5
              className={
                this.props.user.status === 'updatingUser' ? 'orange' : 'hide'
              }
            >
              {this.props.user.statusMessage}
            </h5>
            <h5
              className={
                this.props.user.status === 'updateUserFailed' ?
                  'error-msg red lighten-2' : 'hide'
              }
            >
              {this.props.user.statusMessage}
            </h5>
            <h5
              className={
                this.state.hasValidTargetUserId ?
                  'hide' : 'red lighten-2 white-text'
              }
            >{this.state.message}</h5>
            <h5
              className={
                this.props.user.status === 'updatedUser' ?
                  'success-msg teal lighten-2' : 'hide'
              }
            >
              {this.props.user.statusMessage}
            </h5>
          </div>
          <div>
            <h3>Update profile</h3>
            <div className="divider" />
            <form id="update-user-form">
              <Row>
                <Col s={12}>
                  {this.showRoleUpdate()}
                </Col>
                <Col s={12}>
                  <Col s={12} m={6}>
                    <span className="green-label">First name</span>
                    <Input
                      id="update-first-name"
                      s={12}
                      placeholder={this.state.targetUser.firstName}
                      className="tooltipped"
                      data-position="top"
                      data-delay="50"
                      data-tooltip={firstNameTooltip}
                      onChange={this.updateFirstName}
                    >
                      <Icon>face</Icon>
                    </Input>
                  </Col>
                  <Col s={12} m={6}>
                    <span className="green-label">Last Name</span>
                    <Input
                      id="update-last-name"
                      s={12}
                      placeholder={this.state.targetUser.lastName}
                      className="tooltipped"
                      data-position="top"
                      data-delay="50"
                      data-tooltip={lastNameTooltip}
                      onChange={this.updateLastName}
                    >
                      <Icon>face</Icon>
                    </Input>
                  </Col>
                </Col>
                <Col s={12}>
                  <Col s={12} m={6}>
                    <span className="green-label">Email</span>
                    <Input
                      id="update-username"
                      type="email"
                      s={12}
                      placeholder={this.state.targetUser.username}
                      className="tooltipped"
                      data-position="top"
                      data-delay="50"
                      data-tooltip={userNameTooltip}
                      onChange={this.updateUsername}
                    >
                      <Icon>account_circle</Icon>
                    </Input>
                  </Col>
                  <Col s={12} m={6}>
                    <span className="green-label">Password</span>
                    <Input
                      id="update-password"
                      s={12}
                      type="password"
                      className="tooltipped"
                      data-position="top"
                      data-delay="50"
                      data-tooltip={passwordTootip}
                      onChange={this.updatePassword}
                    >
                      <Icon>lock</Icon>
                    </Input>
                  </Col>
                </Col>
                <Col s={12}>
                  <Button
                    id="attempt-profile-update-btn"
                    className={
                      this.isUpdate() &&
                      this.props.user.status !== 'updatingUser' ? 'hoverable' : 'disabled'
                    }
                    waves="light"
                    onClick={this.attemptProfileUpdate}
                  >
                    Update
                    <Icon left>update</Icon>
                  </Button>
                </Col>
              </Row>
            </form>
            <div
              className={
                this.props.user.status === 'updatingUser' ?
                '' :
                'hide'
              }
            >
              <ProgressBar />
            </div>
          </div>
          <div className="divider" />
          {this.showDeleteAccountSection()}
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
    if (!this.props.user.isLoggedIn) {
      Materialize.toast(this.props.user.statusMessage, 5000);
      return <Redirect to="/" />;
    }

    return (
      <div id="update-user-page" className="scrollable-page">
        {this.showUpdateForm()}
      </div>
    );
  }
}

UpdateUserPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default UpdateUserPage;
