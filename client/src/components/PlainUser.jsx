import React from 'react';
import PropTypes from 'prop-types';

/**
 * PlainUser - Renders a plain profile of a user.
 * @param {Object} props - The data passed to this component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
function PlainUser(props) {
  const getRoleName = (roleId) => {
    let roleName = 'Regular';
    if (roleId > 0) {
      roleName = 'Admin';
    }
    return roleName;
  };

  return (
    <div>
      <div className="col s12 m4 hoverable">
        <div
          className={
            props.roleId > 0 ?
            'card small horizontal admin-user-profile' :
            'card small horizontal'
          }
        >
          <div className="card-stacked">
            <div className="card-content">
              <h5 className="teal-text text-lighten-2">
                {`${props.firstName} ${props.lastName}`}
              </h5>
              <div className="divider" />
              <h6>Email: <br /></h6>
              <div className="chip">{props.username}</div>
              <h6>Account type: <br /></h6>
              <div className="chip">{getRoleName(props.roleId)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PlainUser.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  roleId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired
};

PlainUser.defaultProps = {
  imgUrl: '/img/anonymous-user-thumbnail.png'
};

export default PlainUser;
