import React from 'react';
import { Icon, SideNavItem } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import uuid from 'uuid';
import { logout } from '../../actions/UserActions';
import ViewUserDocumentsPage from './ViewUserDocumentsPage';
import UpdateUserPage from './UpdateUserPage';
import ViewAllUsersPage from './ViewAllUsersPage';
import UpdateDocumentPage from './UpdateDocumentPage';
import ViewAllDocumentsPage from './ViewAllDocumentsPage';
import SearchUsersPage from './SearchUsersPage';
import SearchDocumentsPage from './SearchDocumentsPage';
import SideMenu from '../siteNavigation/SideMenu';

/**
 * MainContainer - Renders all the Components of the dashboard.
 */
export class MainContainer extends React.Component {
  /**
   * Creates and initializes an instance of MainContainer.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.getAdminSection = this.getAdminSection.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  /**
   * Renders menu options that are meant for admin users only.
   * @return {Array|null} - Returns an array of Components to render, or null
   * if the current user is not an admin.
   */
  getAdminSection() {
    if (this.props.user.user.roleId > 0) {
      return [
        (<li id="view-all-users-btn" key={uuid.v4()}>
          <NavLink
            exact
            to="/dashboard/users"
            activeClassName="teal lighten-2 white-text disabled"
          >
            <Icon left>people</Icon>
            Users
          </NavLink>
        </li>),
        (<SideNavItem divider key={uuid.v4()} />)
      ];
    }
  }

  /**
   * Attempts to log a user out.
   * @return {null} - Returns nothing.
   */
  handleLogout() {
    this.props.dispatch(logout());
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    if (this.props.user.status === 'deletedUser') {
      $('#delete-user-modal').modal('close');
    }

    if (!this.props.user.isLoggedIn) {
      Materialize.toast(this.props.user.statusMessage, 5000);
      return <Redirect to="/" />;
    }

    if (this.props.documents.status === 'documentCreated') {
      $('#create-document-modal').modal('close');
    }

    return (
      // TODO: Rename this root element to #dashboard-main-container.
      <div id="authenticated-user-area" className="grey lighten-3">
        <SideMenu
          handleLogout={this.handleLogout}
          getAdminSection={this.getAdminSection}
          {...this.props}
        />
        <Switch>
          <Route
            path="/dashboard/updateDocument"
            render={() => <UpdateDocumentPage {...this.props} />}
          />
          <Route
            path="/dashboard/users"
            render={() => <ViewAllUsersPage {...this.props} />}
          />
          <Route
            path="/dashboard/updateUser"
            render={() => <UpdateUserPage{...this.props} />}
          />
          <Route
            path="/dashboard/profile"
            render={() => <UpdateUserPage {...this.props} />}
          />
          <Route
            path="/dashboard/myDocuments"
            render={() => <ViewUserDocumentsPage {...this.props} />}
          />
          <Route
            path="/dashboard/searchDocuments"
            render={() => <SearchDocumentsPage {...this.props} />}
          />
          <Route
            path="/dashboard/searchUsers"
            render={() => <SearchUsersPage {...this.props} />}
          />
          <Route
            exact
            path="*"
            render={() => <ViewAllDocumentsPage {...this.props} />}
          />
        </Switch>
      </div>
    );
  }
}

const mapStoreToProps = store => ({
  documents: store.documents,
  search: store.search,
  user: store.user
});

MainContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default connect(mapStoreToProps)(MainContainer);
