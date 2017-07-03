import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-materialize';

/**
 * User - Renders the profile of a user.
 * @param {Object} props - The data passed to this component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
function User(props) {
  const getRoleName = (roleId) => {
    let roleName = 'Regular';
    if (roleId > 0) {
      roleName = 'Admin';
    }
    return roleName;
  };
  return (
    <div>
      <div className="col s12 m6 l4 hoverable">
        <div className={props.roleId > 0 ? 'card small horizontal admin-user-card' : 'card small horizontal'}>
          <div className="card-image">
            <img
              src={props.imgUrl}
              alt={`${props.firstName} ${props.lastName}`}
            />
          </div>
          <div className="card-stacked">
            <div className="card-content">
              <h5 className="teal-text text-lighten-2">{`${props.firstName} ${props.lastName}`}</h5>
              <div className="divider" />
              <h6>Email: <br />
                <div className="chip">{props.username}</div>
              </h6>
              <h6>Account type: <br />
                <div className="chip">{getRoleName(props.roleId)}</div>
              </h6>
            </div>
            <div className="card-action">
              <ul className="document-actions valign-wrapper">
                <li>
                  <Button
                    floating
                    className="teal lighten-2 quarter-side-margin"
                    waves="light"
                    icon="mode_edit"
                  />
                </li>
                <li>
                  <Button
                    floating
                    className="red quarter-side-margin"
                    waves="light"
                    icon="delete_forever"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

User.propTypes = {
  firstName: PropTypes.string.isRequired,
  imgUrl: PropTypes.string,
  lastName: PropTypes.string.isRequired,
  roleId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired
};

User.defaultProps = {
  imgUrl: '/img/anonymous-user-thumbnail.png'
};

export default User;
