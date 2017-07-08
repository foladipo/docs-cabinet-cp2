import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Preloader, Row } from 'react-materialize';
import uuid from 'uuid';
import { fetchAllDocuments } from '../actions/DocumentActions';
import { DOCUMENT_LIMIT, DOCUMENT_OFFSET } from '../constants';
import PlainDocument from './PlainDocument';

/**
 * ViewAllDocumentsPage - Shows a list of public, personal or 'role' documents.
 */
class ViewAllDocumentsPage extends Component {
  /**
   * Creates and initializes an instance of ViewAllDocumentsPage.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.startAllDocumentsFetch = this.startAllDocumentsFetch.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    if (
      this.props.documents.allDocuments === undefined ||
      this.props.documents.allDocuments.length < 1
    ) {
      this.startAllDocumentsFetch();
    }
  }

  /**
   * Attempts to fetch all the documents in this app that this user is
   * permitted to see.
   * @return {null} - Returns nothing.
   */
  startAllDocumentsFetch() {
    this.props.dispatch(fetchAllDocuments(
      this.props.user.token,
      DOCUMENT_LIMIT,
      DOCUMENT_OFFSET
    ));
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const documentComponents = this.props.documents.allDocuments.map(doc => (
      <PlainDocument
        key={uuid.v4()}
        currentUserId={this.props.user.user.id}
        {...doc}
      />
    ));

    const showStatusMessage =
      this.props.documents.status === 'fetchingAllDocuments' ||
      this.props.documents.status === 'fetchAllDocumentsFailed';

    return (
      <div className="scrollable-page all-documents-page">
        <h4>All documents</h4>
        <div>
          <h5 className={showStatusMessage ? '' : 'hide'}>
            {this.props.documents.statusMessage}
          </h5>
          <Row className={
            this.props.documents.status === 'fetchingAllDocuments' ? '' : 'hide'
            }
          >
            <Col s={4} offset="s4">
              <Preloader size="big" flashing />
            </Col>
          </Row>
          <Button
            onClick={this.startAllDocumentsFetch}
            className={
              this.props.documents.status === 'fetchAllDocumentsFailed' ? '' : 'hide'
            }
          >
            {this.props.documents.statusMessage}
          </Button>
        </div>
        <div
          className={
            this.props.documents.allDocuments.length < 1 &&
            this.props.documents.status !== 'fetchingAllDocuments' ? '' : 'hide'
          }
        >
          <h5 className="teal lighten-2 white-text center">
            There are no documents. Please create some, and encourage
            other users to do so too.
          </h5>
        </div>
        <div className="row">{documentComponents}</div>
      </div>
    );
  }
}

ViewAllDocumentsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default ViewAllDocumentsPage;
