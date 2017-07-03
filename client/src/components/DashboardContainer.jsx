import React from 'react';
import { Button, Icon, Modal, SideNav, SideNavItem } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, Switch } from 'react-router-dom';
import uuid from 'uuid';
import { fetchUserDocuments } from '../actions/DocumentActions';
import { logout } from '../actions/UserActions';
import DashboardPage from './DashboardPage';
import UsersPage from './UsersPage';
import UpdateDocument from './UpdateDocument';

/**
 * DashboardContainer - Renders the dashboard.
 */
class DashboardContainer extends React.Component {
  /**
   * Creates and initializes an instance of DashboardContainer.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      limit: 30,
      offset: 0
    };

    this.startDocumentsFetch = this.startDocumentsFetch.bind(this);
    this.getAdminSection = this.getAdminSection.bind(this);
    this.logout = this.logout.bind(this);
  }

  // TODO: Move this to DashboardPage.
  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    this.startDocumentsFetch();
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
   * Attempts to fetch a user's documents.
   * @return {null} - Returns nothing.
   */
  startDocumentsFetch() {
    this.props.dispatch(fetchUserDocuments(
      this.props.user.token,
      this.props.user.user.id,
      this.state.limit,
      this.state.offset
    ));
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
    if (!this.props.user.isLoggedIn) {
      return <Redirect to="/" />;
    }

    if (this.props.documents.status === 'invalidTokenError') {
      window.localStorage.clear();
      Materialize.toast(this.props.documents.statusMessage, 5000);
      return <Redirect to="/" />;
    }

    if (this.props.documents.status === 'documentCreated') {
      $('#updateDocumentModal').modal('close');
    }

    if (this.props.documents.status !== 'fetchingDocuments') {
      Materialize.toast(this.props.documents.statusMessage, 3000);
    }

    const trigger = <Button className="dashboard-menu-btn">Menu<Icon left>menu</Icon></Button>;

    return (
      <div className="authenticated-user-area grey lighten-3">
        <SideNav
          trigger={trigger}
          options={{
            menuWidth: 300,
            closeOnClick: true,
            edge: 'right',
            draggable: true
          }}
        >
          <SideNavItem
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
              id="updateDocumentModal"
              trigger={
                <Button className="col s12">Compose</Button>
              }
            >
              <UpdateDocument {...this.props} mode="create" modeMessage="Create document" />
            </Modal>
          </SideNavItem>
          <SideNavItem divider />
          {this.getAdminSection()}
          <SideNavItem waves onClick={this.logout} icon="input">Logout</SideNavItem>
        </SideNav>

        <Switch>
          <Route path="/dashboard/users" render={() => <UsersPage {...this.props} />} />
          <Route exact path="*" render={() => <DashboardPage {...this.props} />} />
        </Switch>
      </div>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user,
  documents: store.documents
});

DashboardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default connect(mapStoreToProps)(DashboardContainer);
