import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Preloader, Row } from 'react-materialize';
import uuid from 'uuid';
import ReactPaginate from 'react-paginate';
import { fetchAllDocuments } from '../../actions/DocumentActions';
import { Pagination } from '../../constants';
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
    this.handlePageClick = this.handlePageClick.bind(this);
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
      this.fetchDocuments(Pagination.DEFAULT_LIMIT, Pagination.DEFAULT_OFFSET);
    }
  }

  /**
   * Attempts to fetch a section/page of all the documents in this app
   * that this user is permitted to see.
   * @param {Number} limit - Number of documents to return.
   * @param {Number} offset - Number of documents to skip before
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
   * Handles requests to show the next or previous page of documents.
   * @param {Object} data - Data about the pagination request.
   * @return {null} - Returns nothing.
   */
  handlePageClick(data) {
    const selectedPage = data.selected;
    const offset = Math.ceil(selectedPage * Pagination.DEFAULT_LIMIT);
    this.fetchDocuments(Pagination.DEFAULT_LIMIT, offset);
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
        <div
          className={
            this.props.documents.allDocuments.documents.length > 0 ?
            'center-align' :
            'hide'
          }
        >
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel={<a href="">...</a>}
            breakClassName="break-me"
            pageCount={this.props.documents.allDocuments.pageCount}
            initialPage={this.props.documents.allDocuments.page - 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active-pagination-btn"
            pageClassName="pagination-btn"
            previousClassName="pagination-previous-btn"
            nextClassName="pagination-previous-btn"
          />
        </div>
        <Row className={
          this.props.documents.status === 'fetchingAllDocuments' ? '' : 'hide'
          }
        >
          <Col s={12} className="center-align">
            <Preloader size="big" flashing />
          </Col>
          <Col s={12} className="center-align">
            <h5>
              {
                this.props.documents.statusMessage ?
                this.props.documents.statusMessage.replace('Loading', 'Loading more') : ''
              }
            </h5>
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
