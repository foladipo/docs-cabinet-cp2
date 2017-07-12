import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-materialize';
import { Link } from 'react-router-dom';
import ConfirmDocumentDeletion from './ConfirmDocumentDeletion';

/**
 * Document - Renders a single document.
 * @param {Object} props - The data passed to this component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
function Document(props) {
  const getDocImage = () => {
    let img;
    if (props.docImage) {
      img = props.docImage;
    } else {
      if (props.access === 'public') {
        img = '/img/public-documents.png';
      }
      if (props.access === 'private') {
        img = '/img/private-documents.png';
      }
      if (props.access === 'role') {
        img = '/img/role-documents.jpg';
      }
    }
    return img;
  };

  const isDeletingMe = () => {
    if (props.documentsStatus === 'deletingDocument' &&
      props.targetDocumentId === props.id) {
      return true;
    }
    return false;
  };

  return (
    <div className={isDeletingMe() ? 'disabled' : ''}>
      <div className="col s12 m6 l4 hoverable">
        <div className="card small">
          <div className="card-image">
            <img
              className="materialboxed responsive-img"
              src={getDocImage()}
              alt={props.title}
            />
            <span className="card-title black-text">{props.title}</span>
          </div>
          <div className="card-content">
            <p>{props.content}</p>
          </div>
          <div className="card-action">
            <ul className="document-actions valign-wrapper">
              <li>
                <Link to={`/dashboard/updateDocument/${props.id}`}>
                  <Button
                    floating
                    className="teal lighten-2 quarter-side-margin"
                    waves="light"
                    icon="mode_edit"
                  />
                </Link>
              </li>
              <li>
                <Modal
                  className="deleteDocumentModal"
                  header="Delete document"
                  trigger={
                    <Button
                      floating
                      className="red quarter-side-margin"
                      waves="light"
                      icon="delete_forever"
                    />
                  }
                >
                  <ConfirmDocumentDeletion
                    dispatch={props.dispatch}
                    token={props.token}
                    id={props.id}
                    documentsStatus={props.documentsStatus}
                    targetDocumentId={props.targetDocumentId}
                  />
                </Modal>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Document.propTypes = {
  content: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  documentsStatus: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  targetDocumentId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};

export default Document;
