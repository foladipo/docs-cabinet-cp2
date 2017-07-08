import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input } from 'react-materialize';
import { createDocument } from '../actions/DocumentActions';

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
      access: 'public',
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
    this.submitUpdate = this.submitUpdate.bind(this);
  }

  /**
   * Called immediately before rendering, when new props are or
   * state is being received.
   * @param {Object} nextProps - The new props this Component
   * will receive when re-rendered.
   * @return {null} - Returns nothing.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.documents.status === 'documentCreated') {
      this.setState({
        errorMessage: '',
        title: this.props.title,
        content: this.props.content,
        access: 'public',
        categories: this.props.categories,
        tags: this.props.tags
      });
      $('#updateDocumentForm .update-doc-text-input').val('');
      $('#updateDocumentForm .update-doc-select-access').val('public');
    }
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
   * Attempts to update or create a document.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  submitUpdate(event) {
    event.preventDefault();

    // Needed because a form can be submitted without the submit button.
    const title = this.state.title;
    if (!this.hasValidTitle(title)) {
      this.setState({ errorMessage: 'Supply a title that has one or more characters that are not whitespace.' });
      return;
    }
    const content = this.state.content;
    if (!this.hasValidContent(content)) {
      this.setState({ errorMessage: 'Supply a document content that has one or more characters that are not whitespace.' });
      return;
    }
    const categories = this.state.categories;
    if (!this.hasValidCategories(categories)) {
      this.setState({ errorMessage: 'Add one or more comma-separated categories that aren\'t merely whitespace.' });
      return;
    }
    const tags = this.state.tags;
    if (!this.hasValidTags(tags)) {
      this.setState({ errorMessage: 'Please supply one or more comma-separated tags that aren\'t merely whitespace.' });
      return;
    }

    if (this.props.mode === 'create') {
      this.props.dispatch(createDocument(
        this.props.user.token,
        this.state.title,
        this.state.content,
        this.state.access,
        this.state.categories,
        this.state.tags
      ));
    }
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    // TODO: isValidDocument works fine, but why do these all become true once one of them is?
    const isValidDocument = (
      this.hasValidTitle(this.state.title) &&
      this.hasValidContent(this.state.content) &&
      this.hasValidCategories(this.state.categories) &&
      this.hasValidTags(this.state.tags)
    );

    return (
      <div className="row">
        <form id="updateDocumentForm">
          <h6 className="red-text text-lighten-2">**All fields are required.</h6>
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
              defaultValue="public"
              onChange={this.updateAccess}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role">Role</option>
            </Input>
          </div>
          <Input s={12} className="update-doc-text-input" label="Title" type="text" onChange={this.updateTitle}>
            <Icon>title</Icon>
          </Input>
          <Input s={12} className="update-doc-text-input" label="Categories" type="text" onChange={this.updateCategories}>
            <Icon>bookmark_border</Icon>
          </Input>
          <Input s={12} className="update-doc-text-input" label="Tags" type="text" onChange={this.updateTags}>
            <Icon>label_outline</Icon>
          </Input>
          <span className="col s12">Document content<Icon left>mode_edit</Icon></span>
          <br />
          <div className="col s12">
            <textarea
              rows="10"
              className="materialize-textarea update-doc-text-input"
              onChange={this.updateContent}
            />
            <br />
          </div>
          <div className="quarter-vertical-margin" />
          <Button
            onClick={this.submitUpdate}
            modal="confirm"
            className={isValidDocument ? 'quarter-vertical-margin' : 'quarter-vertical-margin disabled'}
          >
            {this.props.modeMessage}
            <Icon left>{this.props.mode === 'create' ? 'note_add' : ''}</Icon>
            <Icon left>{this.props.mode === 'update' ? 'update' : ''}</Icon>
          </Button>
        </form>
      </div>
    );
  }
}

UpdateDocument.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  categories: PropTypes.string,
  tags: PropTypes.string,
  mode: PropTypes.string,
  modeMessage: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired
};

UpdateDocument.defaultProps = {
  title: undefined,
  content: undefined,
  categories: undefined,
  tags: undefined,
  mode: undefined,
  modeMessage: undefined
};

export default UpdateDocument;
