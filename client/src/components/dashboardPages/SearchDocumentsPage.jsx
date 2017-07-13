import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input } from 'react-materialize';
import uuid from 'uuid';
import { searchDocuments } from '../../actions/SearchActions';
import PlainDocument from '../common/PlainDocument';

/**
 * SearchDocumentsPage - Renders a page for searching for documents.
 */
class SearchDocumentsPage extends Component {
  /**
   * Creates and initializes an instance of SearchDocumentsPage.
   * @param {Object} props - The data passed to this Component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      categoriesFilter: '',
      searchQuery: props.search.documents.lastSearchQuery || '',
      tagsFilter: ''
    };

    this.updateSearchQuery = this.updateSearchQuery.bind(this);
    this.updateCategoriesFilter = this.updateCategoriesFilter.bind(this);
    this.updateTagsFilter = this.updateTagsFilter.bind(this);
    this.hasSearchQuery = this.hasSearchQuery.bind(this);
    this.attemptDocumentsSearch = this.attemptDocumentsSearch.bind(this);
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
   * Updates the categories filter stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateCategoriesFilter(event) {
    event.preventDefault();
    this.setState({ categoriesFilter: event.target.value });
  }

  /**
   * Updates the tags filter stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateTagsFilter(event) {
    event.preventDefault();
    this.setState({ tagsFilter: event.target.value });
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
   * Attempts to search for documents.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptDocumentsSearch(event) {
    event.preventDefault();

    if (!this.hasSearchQuery()) {
      this.setState({ showErrorMessage: true });
      return;
    }

    this.props.dispatch(
      searchDocuments(this.props.user.token, this.state.searchQuery)
    );
    this.setState({ showErrorMessage: false });
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const allDocuments = this.props.search.documents.lastSearchResults;

    const filteredByCategories = allDocuments.filter(document =>
      document.categories.toLowerCase()
        .includes(this.state.categoriesFilter.toLowerCase())
    );

    const filteredByTags = filteredByCategories.filter(document =>
      document.tags.toLowerCase()
        .includes(this.state.tagsFilter.toLowerCase())
    );

    const documentProfiles =
      filteredByTags.map(document =>
        (<PlainDocument
          key={uuid.v4()}
          currentUserId={this.props.user.user.id}
          {...document}
        />)
      );

    return (
      <div>
        <h4>Search documents</h4>
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
              Search for any document using part or all of its title.
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
                    'col s10' :
                    'col s10 disabled'
                  }
                  onClick={this.attemptDocumentsSearch}
                >
                  <span className=""><Icon>search</Icon>Search</span>
                </Button>
              </div>
            </form>
            <div className="divider" />
            <h6 className="teal-text text-lighten-2">Filters</h6>
            <div className="row">
              <Input
                s={12}
                label="Filter by categories"
                onChange={this.updateCategoriesFilter}
              />
              <Input
                s={12}
                label="Filter by tags"
                onChange={this.updateTagsFilter}
              />
            </div>
          </div>
          {/* TODO: This section below is not scrollable yet. */}
          <div className="search-results-container col s12 m9 scrollable-page">
            <h6>Search results</h6>
            <div>
              {documentProfiles}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SearchDocumentsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  search: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default SearchDocumentsPage;
