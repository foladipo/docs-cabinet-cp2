import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-materialize';

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

  return (
    <div>
      <div className="col s12 m6 l4 hoverable">
        <div className="card small">
          <div className="card-image">
            <img className="materialboxed responsive-img" src={getDocImage()} alt={props.title} />
            <span className="card-title black-text">{props.title}</span>
          </div>
          <div className="card-content">
            <p>{props.docContent}</p>
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
  );
}

Document.propTypes = {
  access: PropTypes.string,
  docContent: PropTypes.string,
  docImage: PropTypes.string,
  title: PropTypes.string,
};

Document.defaultProps = {
  access: undefined,
  docContent: undefined,
  docImage: undefined,
  title: undefined
};

export default Document;
