import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal, SideNav, SideNavItem } from 'react-materialize';
import { NavLink } from 'react-router-dom';
import uuid from 'uuid';
import CreateDocument from '../common/CreateDocument';

/**
 * SideMenu - Renders the side menu used to navigate this app.
 * @param {Object} props - The data passed to this Component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
function SideMenu(props) {
  const trigger = (
    <Button id="dashboard-menu-btn">
      Menu
      <Icon left>menu</Icon>
    </Button>
  );

  return (
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
          name: `${props.user.user.firstName} ${props.user.user.lastName}`,
          email: props.user.user.username
        }}
      />
      <SideNavItem className="row">
        <Modal
          header="Create Document"
          id="create-document-modal"
          trigger={
            <Button id="compose-document-btn" className="col s12">
              Compose
            </Button>
          }
        >
          <CreateDocument
            mode="create"
            modeMessage="Create document"
            token={props.user.token}
            dispatch={props.dispatch}
            documentsStatus={props.documents.status}
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
      <li id="search-users-btn" key={uuid.v4()}>
        <NavLink
          exact
          to="/dashboard/searchUsers"
          activeClassName="teal lighten-2 white-text disabled"
        >
          <Icon left>search</Icon>
          Search for users
        </NavLink>
      </li>
      <li id="search-documents-btn" key={uuid.v4()}>
        <NavLink
          exact
          to="/dashboard/searchDocuments"
          activeClassName="teal lighten-2 white-text disabled"
        >
          <Icon left>search</Icon>
          Search for documents
        </NavLink>
      </li>
      <li id="my-documents-btn" key={uuid.v4()}>
        <NavLink
          exact
          to="/dashboard/myDocuments"
          activeClassName="teal lighten-2 white-text disabled"
        >
          <Icon left>library_books</Icon>
          My documents
        </NavLink>
      </li>
      <li id="update-profile-btn" key={uuid.v4()}>
        <NavLink
          exact
          to={`/dashboard/profile/${props.user.user.id}`}
          activeClassName="teal lighten-2 white-text disabled"
        >
          <Icon left>person_outline</Icon>
          Update profile
        </NavLink>
      </li>
      <SideNavItem divider />
      {props.getAdminSection()}
      <SideNavItem
        id="logout-btn"
        waves
        onClick={props.handleLogout}
        icon="directions_run"
      >
        Logout
      </SideNavItem>
    </SideNav>
  );
}

SideMenu.propTypes = {
  getAdminSection: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default SideMenu;
