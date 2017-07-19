import React from 'react';
import PropTypes from 'prop-types';
import { Col, Icon, Modal, Row } from 'react-materialize';
import striptags from 'striptags';
import renderHTML from 'react-render-html';

/**
 * PlainDocument - Renders a single document without edit/delete buttons.
 * @param {Object} props - The data passed to this component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
function PlainDocument(props) {
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

  const htmlContent = decodeURIComponent(props.content);

  return (
    <div className="plain-document">
      <div className="col s12 m6 l4 hoverable">
        <Modal
          fixedFooter
          trigger={
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
                <div className="flow-text">
                  {striptags(htmlContent)}
                </div>
              </div>
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
                  <span className="teal-text text-lighten-2">Tags:</span>&nbsp;
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
      </div>
    </div>
  );
}

PlainDocument.propTypes = {
  access: PropTypes.string.isRequired,
  categories: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  currentUserId: PropTypes.number.isRequired,
  docImage: PropTypes.string,
  User: PropTypes.objectOf(PropTypes.any).isRequired,
  tags: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

PlainDocument.defaultProps = {
  docImage: undefined
};

export default PlainDocument;
