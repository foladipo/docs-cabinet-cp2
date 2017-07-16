import React from 'react';
import { Button, Icon, Modal, SideNav, SideNavItem } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import uuid from 'uuid';
import { logout } from '../../actions/UserActions';
import ViewUserDocumentsPage from './ViewUserDocumentsPage';
import UpdateUserPage from './UpdateUserPage';
import ViewAllUsersPage from './ViewAllUsersPage';
import CreateDocument from '../common/CreateDocument';
import UpdateDocumentPage from './UpdateDocumentPage';
import ViewAllDocumentsPage from './ViewAllDocumentsPage';
import SearchUsersPage from './SearchUsersPage';
import SearchDocumentsPage from './SearchDocumentsPage';

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
    this.logout = this.logout.bind(this);
  }

  /**
   * Renders menu options that are meant for admin users only.
   * @return {Array|null} - Returns an array of Components to render, or null
   * if the current user is not an admin.
   */
  getAdminSection() {
    if (this.props.user.user.roleId > 0) {
      return [
        (<li key={uuid.v4()}>
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
  logout() {
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

    const trigger = (<Button id="dashboard-menu-btn">
      Menu
      <Icon left>menu</Icon>
    </Button>);

    return (
      <div id="authenticated-user-area" className="grey lighten-3">
        <SideNav
          id="dashboard-menu"
          trigger={trigger}
          options={{
            menuWidth: 300,
            closeOnClick: true,
            edge: 'right',
            draggable: true
          }}
        >
          <SideNavItem
            id="user-view"
            userView
            className="text-black"
            user={{
              background: '/img/dark-mountains-small.jpg',
              image: '/img/anonymous-user-thumbnail.png',
              name: `${this.props.user.user.firstName} ${this.props.user.user.lastName}`,
              email: this.props.user.user.username
            }}
          />
          <SideNavItem className="row">
            <Modal
              header="Create Document"
              id="create-document-modal"
              trigger={
                <Button className="col s12">Compose</Button>
              }
            >
              <CreateDocument
                mode="create"
                modeMessage="Create document"
                token={this.props.user.token}
                dispatch={this.props.dispatch}
                documentsStatus={this.props.documents.status}
              />
            </Modal>
          </SideNavItem>
          <SideNavItem divider />
          <li key={uuid.v4()}>
            <NavLink
              exact
              to="/dashboard"
              activeClassName="teal lighten-2 white-text disabled"
            >
              <Icon left>home</Icon>
              Home
            </NavLink>
          </li>
          <li key={uuid.v4()}>
            <NavLink
              exact
              to="/dashboard/searchUsers"
              activeClassName="teal lighten-2 white-text disabled"
            >
              <Icon left>search</Icon>
              Search for users
            </NavLink>
          </li>
          <li key={uuid.v4()}>
            <NavLink
              exact
              to="/dashboard/searchDocuments"
              activeClassName="teal lighten-2 white-text disabled"
            >
              <Icon left>search</Icon>
              Search for documents
            </NavLink>
          </li>
          <li key={uuid.v4()}>
            <NavLink
              exact
              to="/dashboard/myDocuments"
              activeClassName="teal lighten-2 white-text disabled"
            >
              <Icon left>library_books</Icon>
              My documents
            </NavLink>
          </li>
          <li key={uuid.v4()} id="update-profile-btn">
            <NavLink
              exact
              to={`/dashboard/profile/${this.props.user.user.id}`}
              activeClassName="teal lighten-2 white-text disabled"
            >
              <Icon left>person_outline</Icon>
              Update profile
            </NavLink>
          </li>
          <SideNavItem divider />
          {this.getAdminSection()}
          <SideNavItem
            id="logout-btn"
            waves
            onClick={this.logout}
            icon="directions_run"
          >
            Logout
          </SideNavItem>
        </SideNav>

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
