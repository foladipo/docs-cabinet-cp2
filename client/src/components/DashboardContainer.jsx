import React from 'react';
import { connect } from 'react-redux';
import * as UserActions from '../actions/UserActions';

function DashboardContainer(props) {
  const logout = () => {
    props.dispatch(UserActions.logout());
  };

  return (
    <div>
      <h1>Welcome to the dashboard component!</h1>
      <button onClick={logout}>Log out</button>
    </div>
  );
}

const mapStoreToProps = store => ({
  user: store.user
});

export default connect(mapStoreToProps)(DashboardContainer);
