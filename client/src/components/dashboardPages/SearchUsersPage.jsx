import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input } from 'react-materialize';
import uuid from 'uuid';
import { searchUsers } from '../../actions/SearchActions';
import PlainUser from '../common/PlainUser';

/**
 * SearchUsersPage - Renders a page for searching for users.
 */
class SearchUsersPage extends Component {
  /**
   * Creates and initializes an instance of SearchUsersPage.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: props.search.users.lastSearchQuery || ''
    };

    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.hasSearchQuery = this.hasSearchQuery.bind(this);
    this.attemptUsersSearch = this.attemptUsersSearch.bind(this);
  }

  /**
   * Updates the search query stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateSearchQuery(event) {
    event.preventDefault();
    this.setState({ searchQuery: event.target.value });
  }

  /**
   * Determines whether or not there's a valid search query stored in this
   * Component's state.
   * @return {Boolean} - Returns true if the search query stored in this
   * Component's state is valid, and false if otherwise.
   */
  hasSearchQuery() {
    if (typeof this.state.searchQuery !== 'string') return false;

    const query = this.state.searchQuery;
    const strippedQuery = query.replace(/(\s+)/, '');
    return strippedQuery !== '';
  }

  /**
   * Attempts to search for users.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptUsersSearch(event) {
    event.preventDefault();

    if (!this.hasSearchQuery()) {
      this.setState({ showErrorMessage: true });
      return;
    }

    this.props.dispatch(
      searchUsers(this.props.user.token, this.state.searchQuery)
    );
    this.setState({ showErrorMessage: false });
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const userProfiles = this.props.search.users.lastSearchResults.map(user =>
      <PlainUser key={uuid.v4()} {...user} />
    );

    return (
      <div>
        <h4>Search users</h4>
        <div className="row">
          <div className="search-form-container col s12 m3">
            <h5 className="teal-text text-lighten-2">Search form</h5>
            <h6
              className={
                this.state.showErrorMessage ?
                'red lighten-2 white-text center-align' :
                'hide'
              }
            >
              Please enter a search with at least one non-whitespace character.
            </h6>
            <p>
              Search for any user using part or all of his/her first name,&nbsp;
              last name or email.
            </p>
            <form>
              <div className="row">
                <Input
                  s={12}
                  label="Search"
                  onChange={this.updateSearchQuery}
                />
                <Button
                  className={
                    this.hasSearchQuery() ?
                    'col s10 center-align' :
                    'col s10 center-align disabled'
                  }
                  onClick={this.attemptUsersSearch}
                >
                  <span className=""><Icon>search</Icon>Search</span>
                </Button>
              </div>
            </form>
          </div>
          {/* TODO: This section below is not scrollable yet. */}
          <div className="search-results-container col s12 m9 scrollable-page">
            <h6>Search results</h6>
            <div>
              {userProfiles}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SearchUsersPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  search: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default SearchUsersPage;
