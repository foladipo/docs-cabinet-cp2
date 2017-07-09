import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, ProgressBar } from 'react-materialize';
import { updateDocument } from '../actions/DocumentActions';

/**
 * UpdateDocument - Used to update a document. If that document
 * doesn't exist, it will create it.
 */
class UpdateDocument extends Component {
  /**
   * Creates and initializes an instance of UpdateDocument.
   * @param {Object} props - The data passed to this component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      title: props.title,
      content: props.content,
      access: props.access,
      categories: props.categories,
      tags: props.tags
    };

    this.hasValidTitle = this.hasValidTitle.bind(this);
    this.hasValidContent = this.hasValidContent.bind(this);
    this.hasValidCategories = this.hasValidCategories.bind(this);
    this.hasValidTags = this.hasValidTags.bind(this);
    this.updateAccess = this.updateAccess.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateCategories = this.updateCategories.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.isUpdate = this.isUpdate.bind(this);
    this.isValidDocument = this.isValidDocument.bind(this);
    this.submitUpdate = this.submitUpdate.bind(this);
  }

  // TODO: Is this needed?
  /**
   * Called immediately before rendering, when new props are or
   * state is being received.
   * @param {Object} nextProps - The new props this Component
   * will receive when re-rendered.
   * @return {null} - Returns nothing.
   */
  componentWillReceiveProps(nextProps) {
    // if (nextProps.documentsStatus === 'documentCreated') {
    //   this.setState({
    //     errorMessage: '',
    //     title: this.props.title,
    //     content: this.props.content,
    //     access: this.props.access || 'public',
    //     categories: this.props.categories,
    //     tags: this.props.tags
    //   });
    //   $('#updateDocumentForm .update-doc-text-input').val('');
    //   $('#updateDocumentForm .update-doc-select-access').val('public');
    // }
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
   * Updates the title stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateTitle(event) {
    this.setState({ title: event.target.value });
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
   * Updates the categories stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateCategories(event) {
    this.setState({ categories: event.target.value });
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
   * Checks whether or not any part of a document (title,
   * tags etc) has changed.
   * @return {Boolean} - Returns true if any part of a document has
   * changed, and false if otherwise.
   */
  isUpdate() {
    return (
      this.props.title !== this.state.title ||
      this.props.content !== this.state.content ||
      this.props.access !== this.state.access ||
      this.props.categories !== this.state.categories ||
      this.props.tags !== this.state.tags
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
    if (this.state.title !== this.props.title) {
      updateInfo.title = this.state.title;
    }
    if (this.state.content !== this.props.content) {
      updateInfo.content = this.state.content;
    }
    if (this.state.access !== this.props.access) {
      updateInfo.access = this.state.access;
    }
    if (this.state.categories !== this.props.categories) {
      updateInfo.categories = this.state.categories;
    }
    if (this.state.tags !== this.props.tags) {
      updateInfo.tags = this.state.tags;
    }

    this.props.dispatch(updateDocument(
      this.props.token,
      this.props.id,
      updateInfo
    ));
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    if (this.props.documentsStatus === 'documentUpdated') {
      Materialize.toast(this.props.documentsStatusMessage, 3000);
      $('.modal').modal('close');
      // $('.modal-overlay').attr({ 'display': 'none' });
      return null;
    }
    return (
      <div className="row">
        <form id="updateDocumentForm">
          <h6 className="red-text text-lighten-2">
            **All fields are required.
          </h6>
          <div className="red lighten-2">
            <p className="white-text center">
              {this.state.errorMessage}
            </p>
          </div>
          <div className="row">
            <Icon s={1} left>visibility</Icon>
            <Input
              s={12}
              m={6}
              type="select"
              label="Access type"
              className="update-doc-select-access"
              defaultValue={this.props.access}
              onChange={this.updateAccess}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role">Role</option>
            </Input>
          </div>
          <Input
            s={12}
            className="update-doc-text-input"
            label="Title"
            type="text"
            defaultValue={this.props.title}
            onChange={this.updateTitle}
          >
            <Icon>title</Icon>
          </Input>
          <Input
            s={12}
            className="update-doc-text-input"
            label="Categories"
            type="text"
            defaultValue={this.props.categories}
            onChange={this.updateCategories}
          >
            <Icon>bookmark_border</Icon>
          </Input>
          <Input
            s={12}
            className="update-doc-text-input"
            label="Tags"
            type="text"
            defaultValue={this.props.tags}
            onChange={this.updateTags}
          >
            <Icon>label_outline</Icon>
          </Input>
          <span className="col s12">
            Document content<Icon left>mode_edit</Icon>
          </span>
          <br />
          <div className="col s12">
            <textarea
              rows="10"
              className="materialize-textarea update-doc-text-input"
              defaultValue={this.props.content}
              onChange={this.updateContent}
            />
            <br />
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
            {this.props.modeMessage}
            <Icon left>update</Icon>
          </Button>
        </form>
        <ProgressBar
          className={
            this.props.documentsStatus === 'updatingDocument' ?
            '' :
            'hide'
          }
        />
      </div>
    );
  }
}

UpdateDocument.propTypes = {
  access: PropTypes.string.isRequired,
  categories: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  documentsStatus: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  modeMessage: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default UpdateDocument;
