import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Col, Preloader, Row } from 'react-materialize';
import ReactPaginate from 'react-paginate';
import { fetchAllUsers } from '../../actions/UserActions';
import { Pagination } from '../../constants';
import User from '../common/User';

/**
 * ViewAllUsersPage - Renders a list of users.
 */
class ViewAllUsersPage extends Component {
  /**
   * Creates and initializes an instance of ViewAllUsersPage.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = { hasFetchedAllUsers: false };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    if (this.props.user.allUsers.users.length < 1) {
      this.fetchUsers(Pagination.DEFAULT_LIMIT, Pagination.DEFAULT_OFFSET);
    }
  }

  /**
   * Attempts to fetch all the users in this app.
   * @param {String} limit - Number of users to return.
   * @param {String} offset - Number of users to skip before
   * beginning the fetch.
   * @return {null} - Returns nothing.
   */
  fetchUsers(limit, offset) {
    this.props.dispatch(fetchAllUsers(
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
    this.fetchUsers(
      Pagination.DEFAULT_LIMIT,
      offset
    );
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    let users;
    if (this.props.user.allUsers.users) {
      users = this.props.user.allUsers.users.map(user =>
        <User key={uuid.v4()} {...user} />)
      ;
    }

    // TODO: Maybe add a 'retry' button for when a documents fetch fails?
    return (
      <div id="all-users-page" className="scrollable-page">
        <h3
          className={
            this.props.user.status === 'fetchedAllUsers' &&
            this.props.user.allUsers.users.length < 1 ? '' : 'hide'
          }
        >
          {this.props.user.statusMessage}
        </h3>
        <div className="row">
          {users}
        </div>
        <Row className={
          this.props.user.status === 'fetchingAllUsers' ? '' : 'hide'
          }
        >
          <Col s={12} className="center-align">
            <Preloader size="big" flashing />
          </Col>
          <Col s={12} className="center-align">
            <h5>
              {
                this.props.user.statusMessage ?
                this.props.user.statusMessage.replace('Loading', 'Loading more') :
                'Loading...'
              }
            </h5>
          </Col>
        </Row>
        <div
          className={
            this.props.user.allUsers.users.length > 0 ?
            'center-align' :
            'hide'
          }
        >
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel={<a href="">...</a>}
            breakClassName="break-me"
            pageCount={this.props.user.allUsers.pageCount}
            initialPage={this.props.user.allUsers.page - 1}
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
          this.props.user.status === 'fetchAllUsersFailed' ? '' : 'hide'
          }
        >
          <Col s={12} className="red lighten-2 white-text center-align">
            <h5>{this.props.user.statusMessage}</h5>
          </Col>
        </Row>
      </div>
    );
  }
}

ViewAllUsersPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default ViewAllUsersPage;
