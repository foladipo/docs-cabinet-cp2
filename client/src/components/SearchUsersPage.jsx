import React, { Component } from 'react';
import { Button, Icon, Input } from 'react-materialize';

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

    this.state = {};

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
    if (this.state.searchQuery === undefined) return false;

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

    if (!this.hasSearchQuery()) return;

    // Dispstch an action tosearch for users.
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    return (
      <div>
        <h4>Search users</h4>
        <div className="row">
          <div className="search-form-container col s12 m3">
            <h5 className="teal-text text-lighten-2">Search form</h5>
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
                  className={this.hasSearchQuery() ? 'col s6' : 'col s6 disabled'}
                  onClick={this.attemptUsersSearch}
                >
                  <Icon left>search</Icon>
                  Search
                </Button>
              </div>
            </form>
          </div>
          <div className="scrollable-page search-results-container col s12 m9">
            Search results
          </div>
        </div>
      </div>
    );
  }
}

export default SearchUsersPage;
