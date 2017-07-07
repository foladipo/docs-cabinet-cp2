import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Preloader, Row } from 'react-materialize';
import uuid from 'uuid';
import Document from './Document';
import { fetchUserDocuments } from '../actions/DocumentActions';
import { DOCUMENT_LIMIT, DOCUMENT_OFFSET } from '../constants/';

/**
 * ViewUserDocumentsPage - Renders the dashboard, which is mainly a list of
 * public, personal or 'role' documents.
 */
class ViewUserDocumentsPage extends Component {
  /**
   * Creates and initializes an instance of ViewUserDocumentsPage.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.startDocumentsFetch = this.startDocumentsFetch.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    // TODO: Check the store for user documents first.
    this.startDocumentsFetch();
  }

  /**
   * Attempts to fetch a user's documents.
   * @return {null} - Returns nothing.
   */
  startDocumentsFetch() {
    this.props.dispatch(fetchUserDocuments(
      this.props.user.token,
      this.props.user.user.id,
      DOCUMENT_LIMIT,
      DOCUMENT_OFFSET
    ));
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const showStatusMessage =
      this.props.documents.status === 'fetchingDocuments' ||
      this.props.documents.status === 'documentsFetchFailed';

    const documentComponents = this.props.documents.documents.map(doc => (
      <Document
        key={uuid.v4()}
        dispatch={this.props.dispatch}
        token={this.props.user.token}
        documentsStatus={this.props.documents.status}
        targetDocumentId={this.props.documents.targetDocumentId}
        {...doc}
      />
    ));

    return (
      <div className="scrollable-page dashboard-page">
        <div className="dashboard-welcome">
          <h5 className={showStatusMessage ? '' : 'hide'}>
            {this.props.documents.statusMessage}
          </h5>
          <Row className={this.props.documents.status === 'fetchingDocuments' ? '' : 'hide'}>
            <Col s={4} offset="s4">
              <Preloader size="big" flashing />
            </Col>
          </Row>
          <Button
            onClick={this.startDocumentsFetch}
            className={this.props.documents.status === 'documentsFetchFailed' ? '' : 'hide'}
          >
            {this.props.documents.statusMessage}
          </Button>
        </div>
        <div
          className={
            this.props.documents.documents.length < 1 &&
            this.props.documents.status !== 'fetchingDocuments' ? '' : 'hide'
          }
        >
          <h5 className="teal lighten-2 white-text center">
            You don&rsquo;t have any documents. Please create some.
          </h5>
        </div>
        <div className="dashboard-documents row">{documentComponents}</div>
      </div>
    );
  }
}


ViewUserDocumentsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default ViewUserDocumentsPage;
