import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Preloader, Row } from 'react-materialize';
import uuid from 'uuid';
import { fetchAllDocuments } from '../../actions/DocumentActions';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../constants';
import PlainDocument from '../common/PlainDocument';

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
      hasFetchedAllDocuments: false
    };

    this.fetchDocuments = this.fetchDocuments.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    if (
      this.props.documents.allDocuments.documents === undefined ||
      this.props.documents.allDocuments.documents.length < 1
    ) {
      this.fetchDocuments(DEFAULT_LIMIT, DEFAULT_OFFSET);
    }

    const allDocsPageElement = $('#all-documents-page');
    allDocsPageElement.on('scroll', () => {
      if (
        (allDocsPageElement.scrollTop() + allDocsPageElement.innerHeight()) >=
        allDocsPageElement[0].scrollHeight
      ) {
        if (this.props.documents.status !== 'fetchingAllDocuments') {
          if (
            this.props.documents.allDocuments.page ===
            this.props.documents.allDocuments.pageCount
          ) {
            this.setState({
              hasFetchedAllDocuments: true
            });
            return;
          }

          const limit = DEFAULT_LIMIT;
          const offset =
            this.props.documents.allDocuments.page * DEFAULT_LIMIT;
          this.fetchDocuments(limit, offset);
        }
      }
    });
  }

  /**
   * Attempts to fetch all the documents in this app that this user is
   * permitted to see.
   * @param {String} limit - Number of documents to return.
   * @param {String} offset - Number of documents to skip before
   * beginning the fetch.
   * @return {null} - Returns nothing.
   */
  fetchDocuments(limit, offset) {
    this.props.dispatch(fetchAllDocuments(
      this.props.user.token,
      limit,
      offset
    ));
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const documentComponents =
      this.props.documents.allDocuments.documents.map(doc => (
        <PlainDocument
          key={uuid.v4()}
          currentUserId={this.props.user.user.id}
          {...doc}
        />
    ));

    const showStatusMessage =
      this.props.documents.status === 'fetchingAllDocuments' ||
      this.props.documents.status === 'fetchAllDocumentsFailed';

    // TODO: Maybe add a 'retry' button for when a documents fetch fails?
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
        </div>
        <div
          className={
            this.props.documents.allDocuments.documents.length < 1 &&
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
          <Col s={12} className="center-align">
            <h5>{this.props.documents.statusMessage.replace('Loading', 'Loading more')}</h5>
          </Col>
        </Row>
        <Row
          className={
            this.state.hasFetchedAllDocuments ? 'thats-all' : 'hide'
          }
        >
          <Col s={12} className="blue white-text center-align">
            <h5>That&rsquo;s all! There are no documents left.</h5>
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
