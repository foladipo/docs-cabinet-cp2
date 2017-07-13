import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, ProgressBar, Row } from 'react-materialize';
import { deleteDocument } from '../../actions/DocumentActions';

/**
 * ConfirmDocumentDeletion - Asks a user for confirmation before deleting
 * a document.
 * @param {Object} props - The data passed to this component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
function ConfirmDocumentDeletion(props) {
  const closeMe = () => {
    $('.modal').modal('close');
  };

  const deleteMe = () => {
    props.dispatch(deleteDocument(props.token, props.id));
    closeMe();
  };

  if (props.documentsStatus === 'documentDeleted' &&
    props.targetDocumentId === props.id) {
    closeMe();
    return null;
  }

  return (
    <div className="container">
      <h3 className="center-align red-text text-lighten-2">Are you sure?</h3>
      <Row>
        <Col s={6}>
          <Button
            className="red right"
            onClick={deleteMe}
          >
            Yes, delete it!
          </Button>
        </Col>
        <Col s={6}>
          <Button onClick={closeMe}>No. Leave it alone.</Button>
        </Col>
      </Row>
      <div
        className={props.documentsStatus === 'deletingDocument' ? '' : 'hide'}
      >
        <ProgressBar />
      </div>
    </div>
  );
}

ConfirmDocumentDeletion.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documentsStatus: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  targetDocumentId: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired
};

export default ConfirmDocumentDeletion;
