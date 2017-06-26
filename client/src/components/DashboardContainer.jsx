import React from 'react';
import { Button, SideNav, SideNavItem } from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as UserActions from '../actions/UserActions';

/**
 * DashboardContainer - Renders the dashboard.
 */
class DashboardContainer extends React.Component {
  /**
   * Creates and initializes an instance of DashboardContainer.
   * @param {Object} props - The data passed to this component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      content: ''
    };

    this.logout = this.logout.bind(this);
  }

  /**
   * Attempts to log a user out.
   * @return {null} - Returns nothing.
   */
  logout() {
    this.props.dispatch(UserActions.logout());
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const trigger = <Button>SIDE NAV DEMO</Button>;
    return (
      <div className="authenticated-user-area white">
        <SideNav
          trigger={trigger}
          options={{
            closeOnClick: true,
            edge: 'right',
            draggable: true
          }}
        >
          <SideNavItem
            userView
            className="text-black"
            user={{
              background: 'img/dark-mountains-small.jpg',
              image: 'img/anonymous-user-thumbnail.png',
              name: `${this.props.user.user.firstName} ${this.props.user.user.lastName}`,
              email: this.props.user.user.username
            }}
          />
          <SideNavItem className="row">
            <Button className="col s12">
              Compose
            </Button>
          </SideNavItem>
          <SideNavItem divider />
          <SideNavItem href="#!second">Second Link</SideNavItem>
          <SideNavItem divider />
          <SideNavItem subheader>Subheader</SideNavItem>
          <SideNavItem waves href="#!third">Third Link With Waves</SideNavItem>
          <SideNavItem waves onClick={this.logout} icon="input">Logout</SideNavItem>
        </SideNav>
      </div>
    );
  }
}

const mapStoreToProps = store => ({
  user: store.user
});

DashboardContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default connect(mapStoreToProps)(DashboardContainer);
