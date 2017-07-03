import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, Row } from 'react-materialize';

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
        >
          <option value="0">Regular</option>
          <option value="1">Admin</option>
        </Input>
      );
    }
  }

  /**
   * Called to show the profile update form if the target user has been determined.
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  showUpdateForm() {
    if (this.state.targetUser) {
      return (
        <div className="container">
          <div>
            <h3>Update profile</h3>
            <div className="divider" />
            <form>
              {this.showRoleUpdate()}
              <Row>
                <Input s={6} label="First Name" defaultValue={this.state.targetUser.firstName} />
                <Input s={6} label="Last Name" defaultValue={this.state.targetUser.lastName} />
                <Input
                  type="email"
                  label="Email"
                  s={12}
                  defaultValue={this.state.targetUser.username}
                />
                <Input type="password" label="password" s={12} />
                <Button
                  className="hoverable"
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
