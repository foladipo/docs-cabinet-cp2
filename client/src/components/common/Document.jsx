import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Icon, Modal, Row } from 'react-materialize';
import { Link } from 'react-router-dom';
import striptags from 'striptags';
import renderHTML from 'react-render-html';
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

  const htmlContent = decodeURIComponent(props.content);

  return (
    <div className={isDeletingMe() ? 'single-document disabled' : 'single-document'}>
      <div className="col s12 m6 l4 hoverable">
        <div className="card small">
          <Modal
            fixedFooter
            trigger={
              <div className="card-image">
                <img
                  className="materialboxed responsive-img"
                  src={getDocImage()}
                  alt={props.title}
                />
                <span className="card-title black-text">{props.title}</span>
              </div>
            }
          >
            <div>
              <h3 className="teal-text text-lighten-2">{props.title}</h3>
              <div className="divider" />
              <Row>
                <Col s={12}>
                  <Icon>label</Icon>
                  <span>
                    <span className="teal-text text-lighten-2">
                      Categories:
                    </span>
                    &nbsp;
                    {props.categories}
                  </span>
                </Col>
                <Col s={12}>
                  <Icon>bookmark</Icon>
                  <span>
                    <span className="teal-text text-lighten-2">
                      Tags:
                    </span>
                    &nbsp;
                    {props.tags}
                  </span>
                </Col>
                <Col s={12}>
                  <Icon>person_outline</Icon>
                  <span>
                    <span className="teal-text text-lighten-2">
                      Author:
                    </span>
                    &nbsp;
                    {
                      props.User.id === props.currentUserId ? 'Me' :
                      `${props.User.firstName} ${props.User.lastName}`
                    }
                  </span>
                </Col>
              </Row>
              <div className="flow-text">
                {renderHTML(htmlContent)}
              </div>
            </div>
          </Modal>
          <div className="card-content">
            <p>{striptags(htmlContent)}</p>
          </div>
          <div className="card-action">
            <ul className="document-actions valign-wrapper">
              <li>
                <Link to={`/dashboard/updateDocument/${props.id}`}>
                  <Button
                    floating
                    className="edit-document-btn teal lighten-2 quarter-side-margin"
                    waves="light"
                    icon="mode_edit"
                  />
                </Link>
              </li>
              <li>
                <Modal
                  className="delete-document-modal"
                  header="Delete document"
                  trigger={
                    <Button
                      className="delete-document-btn red quarter-side-margin"
                      floating
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
  access: PropTypes.string.isRequired,
  categories: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  currentUserId: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  docImage: PropTypes.string,
  documentsStatus: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  tags: PropTypes.string.isRequired,
  targetDocumentId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  User: PropTypes.objectOf(PropTypes.any).isRequired
};

Document.defaultProps = {
  docImage: undefined
};

export default Document;
