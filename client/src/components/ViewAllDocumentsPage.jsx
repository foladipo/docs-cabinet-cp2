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

    this.state = {
      limit: DOCUMENT_LIMIT,
      offset: DOCUMENT_OFFSET
    };

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

    $('#all-documents-page').on('scroll', () => {
      if (
        ($('#all-documents-page').scrollTop() + $('#all-documents-page').innerHeight()) >=
        $('#all-documents-page')[0].scrollHeight
      ) {
        // TODO: Don't make any more API calls when
        // pageCount * limit >= totalCount
        this.props.dispatch(
          fetchAllDocuments(
            this.props.user.token,
            this.state.limit,
            this.state.offset + this.state.limit
          )
        );
        this.setState({
          offset: this.state.offset + this.state.limit
        });
      }
    });
  }

  /**
   * Attempts to fetch all the documents in this app that this user is
   * permitted to see.
   * @return {null} - Returns nothing.
   */
  startAllDocumentsFetch() {
    this.props.dispatch(fetchAllDocuments(
      this.props.user.token,
      this.state.limit,
      this.state.offset
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
      <div
        id="all-documents-page"
        className="scrollable-page all-documents-page"
      >
        <h4>All documents</h4>
        <div>
          <h5 className={showStatusMessage ? '' : 'hide'}>
            {this.props.documents.statusMessage}
          </h5>
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
        <Row className={
          this.props.documents.status === 'fetchingAllDocuments' ? '' : 'hide'
          }
        >
          <Col s={12} className="center-align">
            <Preloader size="big" flashing />
          </Col>
        </Row>
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
