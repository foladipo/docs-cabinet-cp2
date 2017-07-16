import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Preloader, Row } from 'react-materialize';
import uuid from 'uuid';
import Document from '../common/Document';
import { fetchUserDocuments } from '../../actions/DocumentActions';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../constants/';

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

    this.state = { hasFetchedAllUserDocuments: false };

    this.loadUsersDocuments = this.loadUsersDocuments.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    if (
      this.props.documents.userDocuments.documents === undefined ||
      this.props.documents.userDocuments.documents.length < 1
    ) {
      this.loadUsersDocuments(
        this.props.user.user.id, DEFAULT_LIMIT, DEFAULT_OFFSET
      );
    }

    const userDocsPageElement = $('#user-documents-page');
    userDocsPageElement.on('scroll', () => {
      if (
        (userDocsPageElement.scrollTop() + userDocsPageElement.innerHeight()) >=
        userDocsPageElement[0].scrollHeight
      ) {
        if (this.props.documents.status !== 'fetchingUserDocuments') {
          if (
            this.props.documents.userDocuments.page ===
            this.props.documents.userDocuments.pageCount
          ) {
            this.setState({
              hasFetchedAllUserDocuments: true
            });
            return;
          }

          const limit = DEFAULT_LIMIT;
          const offset =
            this.props.documents.userDocuments.page * DEFAULT_LIMIT;
          this.loadUsersDocuments(this.props.user.user.id, limit, offset);
        }
      }
    });
  }

  /**
   * Attempts to fetch a user's documents.
   * @param {String} targetUserId - Id of the user whose documents are to
   * be fetched.
   * @param {String} limit - Number of documents to return.
   * @param {String} offset - Number of documents to skip before
   * beginning the fetch.
   * @return {null} - Returns nothing.
   */
  loadUsersDocuments(targetUserId, limit, offset) {
    this.props.dispatch(fetchUserDocuments(
      this.props.user.token,
      targetUserId,
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
      this.props.documents.userDocuments.documents.map(doc => (
        <Document
          key={uuid.v4()}
          dispatch={this.props.dispatch}
          token={this.props.user.token}
          documentsStatus={this.props.documents.status}
          targetDocumentId={this.props.documents.targetDocumentId}
          documentsStatusMessage={this.props.documents.statusMessage}
          User={this.props.user.user}
          currentUserId={this.props.user.user.id}
          {...doc}
        />
    ));

    // TODO: Maybe add a 'retry' button for when a documents fetch fails?
    return (
      <div
        id="user-documents-page"
        className="scrollable-page user-documents-page"
      >
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
        <div>
          <h5
            className={
              this.props.documents.status === 'fetchUserDocumentsFailed' ?
              '' : 'hide'
            }
          >
            {this.props.documents.statusMessage}
          </h5>
        </div>
        <Row className={
          this.props.documents.status === 'fetchingUserDocuments' ? '' : 'hide'
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
            this.state.hasFetchedAllUserDocuments ? 'thats-all' : 'hide'
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

ViewUserDocumentsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default ViewUserDocumentsPage;
