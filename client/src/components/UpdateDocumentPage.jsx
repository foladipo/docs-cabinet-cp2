import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, ProgressBar } from 'react-materialize';
import _ from 'lodash';
import { getDocument, updateDocument } from '../actions/DocumentActions';

/**
 * UpdateDocumentPage - Used to update a document.
 */
class UpdateDocumentPage extends Component {
  /**
   * Creates and initializes an instance of UpdateDocumentPage.
   * @param {Object} props - The data passed to this component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      hasFoundTargetDocument: false,
      targetDocument: {}
    };

    this.determineTargetDocument = this.determineTargetDocument.bind(this);

    this.hasValidTitle = this.hasValidTitle.bind(this);
    this.hasValidContent = this.hasValidContent.bind(this);
    this.hasValidCategories = this.hasValidCategories.bind(this);
    this.hasValidTags = this.hasValidTags.bind(this);
    this.isValidDocument = this.isValidDocument.bind(this);
    this.isUpdate = this.isUpdate.bind(this);

    this.updateAccess = this.updateAccess.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateCategories = this.updateCategories.bind(this);
    this.updateTags = this.updateTags.bind(this);

    this.submitUpdate = this.submitUpdate.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    this.determineTargetDocument();
  }

  /**
   * Called immediately before rendering, when new props are or
   * state is being received.
   * @param {Object} nextProps - The new props this Component
   * will receive when re-rendered.
   * @return {null} - Returns nothing.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.documents.status === 'gotDocument') {
      const targetDocument = nextProps.documents.documentToUpdate;
      if (!(_.isEqual({}, targetDocument))) {
        this.setState({
          hasFoundTargetDocument: true,
          hasValidTargetDocumentId: true,
          targetDocument,
          title: targetDocument.title,
          content: targetDocument.content,
          access: targetDocument.access,
          categories: targetDocument.categories,
          tags: targetDocument.tags
        });
      }
    }
  }

  /**
   * Determines the target document of this update.
   * @return {null} - Returns nothing.
   */
  determineTargetDocument() {
    const targetDocumentId =
      Number.parseInt(this.props.location.pathname.split('/')[3], 10);

    if (Number.isNaN(targetDocumentId)) {
      this.setState({
        hasValidTargetDocumentId: false,
        errorMessage: 'Yikes! The id of the document you wish to update is not a number.'
      });
      return;
    }

    const targetDocumentInArray =
      this.props.documents.userDocuments.filter(
        doc => doc.id === targetDocumentId
      );
    if (targetDocumentInArray.length === 1) {
      const targetDocument = targetDocumentInArray[0];
      this.setState({
        hasFoundTargetDocument: true,
        hasValidTargetDocumentId: true,
        targetDocument,
        title: targetDocument.title,
        content: targetDocument.content,
        access: targetDocument.access,
        categories: targetDocument.categories,
        tags: targetDocument.tags
      });
      return;
    }

    this.props.dispatch(
      getDocument(
        this.props.user.token,
        targetDocumentId
      )
    );
  }

  /**
   * Updates the title stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateTitle(event) {
    this.setState({ title: event.target.value });
  }

  /**
   * Tests the validity of a document's title.
   * @return {Boolean} - Whether or not a document's title is valid.
   */
  hasValidTitle() {
    const title = this.state.title;
    if (!title) return false;
    const strippedTitle = title.replace(/(\s+)/, '');
    return strippedTitle.length > 1;
  }

  /**
   * Updates the document content stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateContent(event) {
    this.setState({ content: event.target.value });
  }

  /**
   * Tests the validity of a document's content.
   * @return {Boolean} - Whether or not a document's content is valid.
   */
  hasValidContent() {
    const content = this.state.content;
    if (!content) return false;
    const strippedContent = content.replace(/(\s+)/, '');
    return strippedContent.length > 1;
  }

  /**
   * Updates the categories stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateCategories(event) {
    this.setState({ categories: event.target.value });
  }

  /**
   * Tests the validity of a document's categories.
   * @return {Boolean} - Whether or not a document's categories are valid.
   */
  hasValidCategories() {
    const categories = this.state.categories;
    if (!categories) return false;
    const strippedCategories = categories.replace(/(\s+)/, '');
    return strippedCategories.length > 1;
  }

  /**
   * Updates the tags stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateTags(event) {
    this.setState({ tags: event.target.value });
  }

  /**
   * Tests the validity of a document's tags.
   * @return {Boolean} - Whether or not a document's tags are valid.
   */
  hasValidTags() {
    const tags = this.state.tags;
    if (!tags) return false;
    const strippedTags = tags.replace(/(\s+)/, '');
    return strippedTags.length > 1;
  }

  /**
   * Updates the access type stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateAccess(event) {
    this.setState({ access: event.target.value });
  }

  /**
   * Checks whether or not any part of a document (title,
   * tags etc) has changed.
   * @return {Boolean} - Returns true if any part of a document has
   * changed, and false if otherwise.
   */
  isUpdate() {
    return (
      this.state.targetDocument.title !== this.state.title ||
      this.state.targetDocument.content !== this.state.content ||
      this.state.targetDocument.access !== this.state.access ||
      this.state.targetDocument.categories !== this.state.categories ||
      this.state.targetDocument.tags !== this.state.tags
    );
  }

  /**
   * Checks whether or not a submitted document is valid i.e all its fields
   * satisfy certain standards.
   * @return {Boolean} - Returns true if the document is valid and false
   * if otherwise.
   */
  isValidDocument() {
    return (
      this.hasValidTitle(this.state.title) &&
      this.hasValidContent(this.state.content) &&
      this.hasValidCategories(this.state.categories) &&
      this.hasValidTags(this.state.tags)
    );
  }

  /**
   * Attempts to update or create a document.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  submitUpdate(event) {
    event.preventDefault();

    // Needed because a form might be submitted without using the submit button.
    const title = this.state.title;
    if (!this.hasValidTitle(title)) {
      this.setState({
        errorMessage: 'Supply a title that has two or more characters that are not whitespace.'
      });
      return;
    }
    const content = this.state.content;
    if (!this.hasValidContent(content)) {
      this.setState({
        errorMessage: 'Supply a document content that has two or more characters that are not whitespace.'
      });
      return;
    }
    const categories = this.state.categories;
    if (!this.hasValidCategories(categories)) {
      this.setState({
        errorMessage: 'Add two or more comma-separated categories that aren\'t merely whitespace.'
      });
      return;
    }
    const tags = this.state.tags;
    if (!this.hasValidTags(tags)) {
      this.setState({ errorMessage:
        'Please supply two or more comma-separated tags that aren\'t merely whitespace.'
      });
      return;
    }

    if (!this.isUpdate()) {
      this.setState({
        errorMessage: 'Oops. You haven\'t updated any part of this document.'
      });
      return;
    }

    const updateInfo = {};
    if (this.state.title !== this.state.targetDocument.title) {
      updateInfo.title = this.state.title;
    }
    if (this.state.content !== this.state.targetDocument.content) {
      updateInfo.content = this.state.content;
    }
    if (this.state.access !== this.state.targetDocument.access) {
      updateInfo.access = this.state.access;
    }
    if (this.state.categories !== this.state.targetDocument.categories) {
      updateInfo.categories = this.state.categories;
    }
    if (this.state.tags !== this.state.targetDocument.tags) {
      updateInfo.tags = this.state.tags;
    }

    this.props.dispatch(updateDocument(
      this.props.user.token,
      this.state.targetDocument.id,
      updateInfo
    ));
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    if (this.props.documents.status === 'documentUpdated') {
      Materialize.toast(this.props.documents.statusMessage, 3000);
    }

    return (
      <div className="row">
        <div className={this.props.documents.status === 'getDocumentFailed' ? 'red lighten-2' : 'hide'}>
          <h5 className="white-text center">
            {this.props.documents.statusMessage}
          </h5>
          <h5 className="white-text center">
            {this.state.errorMessage}
          </h5>
        </div>
        <form id="updateDocumentForm" className={this.state.hasValidTargetDocumentId ? '' : 'hide'}>
          <h6 className="red-text text-lighten-2">
            **All fields are required.
          </h6>
          <div className="row">
            <label htmlFor="update-access">
              <h6>Access types</h6>
            </label>
            <Icon s={1} left>visibility</Icon>
            <Input
              s={12}
              m={6}
              type="select"
              id="update-access"
              className="update-doc-select-access"
              onChange={this.updateAccess}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role">Role</option>
            </Input>
          </div>
          <div>
            <label htmlFor="update-title">Title</label>
            <Input
              s={12}
              id="update-title"
              className="update-doc-text-input"
              type="text"
              placeholder={
                this.state.targetDocument ?
                this.state.targetDocument.title : ''
              }
              onChange={this.updateTitle}
            >
              <Icon>title</Icon>
            </Input>
          </div>
          <div>
            <label htmlFor="update-categories">Categories</label>
            <Input
              s={12}
              id="update-categories"
              className="update-doc-text-input"
              type="text"
              placeholder={
                this.state.targetDocument ?
                this.state.targetDocument.categories : ''
              }
              onChange={this.updateCategories}
            >
              <Icon>bookmark_border</Icon>
            </Input>
          </div>
          <div>
            <label htmlFor="update-tags">Tags</label>
            <Input
              s={12}
              id="update-tags"
              className="update-doc-text-input"
              type="text"
              placeholder={
                this.state.targetDocument ?
                this.state.targetDocument.tags : ''
              }
              onChange={this.updateTags}
            >
              <Icon>label_outline</Icon>
            </Input>
          </div>
          <div>
            <br />
            <label htmlFor="update-content">Content</label>
            <Icon left>mode_edit</Icon>
            <div className="col s12">
              <textarea
                rows="10"
                id="update-content"
                className="materialize-textarea update-doc-text-input"
                placeholder={
                  this.state.targetDocument ?
                  this.state.targetDocument.content : ''
                }
                onChange={this.updateContent}
              />
              <br />
            </div>
          </div>
          <div className="quarter-vertical-margin" />
          <Button
            onClick={this.submitUpdate}
            modal="confirm"
            className={
              this.isValidDocument() && this.isUpdate() ?
              'quarter-vertical-margin' :
              'quarter-vertical-margin disabled'
            }
          >
            Update
            <Icon left>update</Icon>
          </Button>
        </form>
        <ProgressBar
          className={
            this.props.documents.status === 'updatingDocument' ?
            '' :
            'hide'
          }
        />
      </div>
    );
  }
}

UpdateDocumentPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};

export default UpdateDocumentPage;
