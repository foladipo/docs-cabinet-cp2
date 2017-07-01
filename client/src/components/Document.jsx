import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-materialize';
import { deleteDocument } from '../actions/DocumentActions';

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
        img = '/img/notice-board.png';
      }
      if (props.access === 'private') {
        img = '/img/PdfViewer_Illustration_Password_Protected_Documents.png';
      }
      if (props.access === 'role') {
        img = '/img/flat-business-team-with-documents-and-laptops_23-2147552538.jpg';
      }
    }
    return img;
  };

  const deleteMe = () => {
    props.dispatch(deleteDocument(props.token, props.id));
  };

  const isDeletingMe = () => {
    if (props.documentsStatus === 'deletingDocument' && props.targetDocument === props.id) {
      return true;
    }
    return false;
  };

  return (
    <div className={isDeletingMe() ? 'disabled' : ''}>
      <div className="col s12 m6 l4 hoverable">
        <div className="card small">
          <div className="card-image">
            <img className="materialboxed responsive-img" src={getDocImage()} alt={props.title} />
            <span className="card-title black-text">{props.title}</span>
          </div>
          <div className="card-content">
            <p>{props.content}</p>
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
                  onClick={deleteMe}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

Document.propTypes = {
  content: PropTypes.string,
  documentsStatus: PropTypes.string,
  id: PropTypes.number,
  title: PropTypes.string,
  targetDocument: PropTypes.string,
};

Document.defaultProps = {
  content: undefined,
  documentsStatus: undefined,
  id: undefined,
  targetDocument: undefined,
  title: undefined
};

export default Document;
