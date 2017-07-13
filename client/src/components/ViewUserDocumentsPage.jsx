import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Preloader, Row } from 'react-materialize';
import uuid from 'uuid';
import Document from './Document';
import { fetchUserDocuments } from '../actions/DocumentActions';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/';

/**
 * ViewUserDocumentsPage - Shows a user a list of his/her own documents.
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
    if (
      this.props.documents.userDocuments === undefined ||
      this.props.documents.userDocuments.length < 1
    ) {
      this.startDocumentsFetch();
    }
  }

  /**
   * Attempts to fetch a user's documents.
   * @return {null} - Returns nothing.
   */
  startDocumentsFetch() {
    this.props.dispatch(fetchUserDocuments(
      this.props.user.token,
      this.props.user.user.id,
      DEFAULT_LIMIT,
      DEFAULT_OFFSET
    ));
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const showStatusMessage =
      this.props.documents.status === 'fetchingUserDocuments' ||
      this.props.documents.status === 'fetchUserDocumentsFailed';

    const documentComponents = this.props.documents.userDocuments.map(doc => (
      <Document
        key={uuid.v4()}
        dispatch={this.props.dispatch}
        token={this.props.user.token}
        documentsStatus={this.props.documents.status}
        targetDocumentId={this.props.documents.targetDocumentId}
        documentsStatusMessage={this.props.documents.statusMessage}
        {...doc}
      />
    ));

    return (
      <div className="scrollable-page user-documents-page">
        <div>
          <h5 className={showStatusMessage ? '' : 'hide'}>
            {this.props.documents.statusMessage}
          </h5>
          <Row className={this.props.documents.status === 'fetchingUserDocuments' ? '' : 'hide'}>
            <Col s={4} offset="s4">
              <Preloader size="big" flashing />
            </Col>
          </Row>
          <Button
            onClick={this.startDocumentsFetch}
            className={this.props.documents.status === 'fetchUserDocumentsFailed' ? '' : 'hide'}
          >
            {this.props.documents.statusMessage}
          </Button>
        </div>
        <div
          className={
            this.props.documents.userDocuments.length < 1 &&
            this.props.documents.status !== 'fetchingUserDocuments' ? '' : 'hide'
          }
        >
          <h5 className="teal lighten-2 white-text center">
            You don&rsquo;t have any documents. Please create some.
          </h5>
        </div>
        <div className="user-documents row">{documentComponents}</div>
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
