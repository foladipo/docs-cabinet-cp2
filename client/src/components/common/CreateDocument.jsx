import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, ProgressBar } from 'react-materialize';
import striptags from 'striptags';
import { createDocument } from '../../actions/DocumentActions';

/**
 * CreateDocument - Used to create a document.
 */
class CreateDocument extends Component {
  /**
   * Creates and initializes an instance of CreateDocument.
   * @param {Object} props - The data passed to this component from its parent.
   */
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: '',
      access: 'public'
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
    this.attemptDocumentCreation = this.attemptDocumentCreation.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    CKEDITOR.replace('create_doc_content_editor');
    CKEDITOR.instances.create_doc_content_editor.on('change', this.updateContent);
  }

  /**
   * Called immediately before rendering, when new props are or
   * state is being received.
   * @param {Object} nextProps - The new props this Component
   * will receive when re-rendered.
   * @return {null} - Returns nothing.
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.documentsStatus === 'documentCreated') {
      this.setState({
        errorMessage: '',
        title: '',
        content: '',
        access: '',
        categories: '',
        tags: ''
      });
      $('#create-document-form .create-doc-text-input').val('');
      CKEDITOR.instances.create_doc_content_editor.setData('');
      $('#create-document-form .create-doc-select-access').val('public');
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

    const htmlContent = decodeURIComponent(content);
    const bareContent = striptags(htmlContent);
    if (!bareContent) return false;

    const contentWithoutWhitespace = bareContent.replace(/(\s+)/, '');
    return contentWithoutWhitespace.length > 1;
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
   * @return {null} - Returns nothing.
   */
  updateContent() {
    const htmlContent = CKEDITOR.instances.create_doc_content_editor.getData();
    const bareContent = striptags(htmlContent);
    if (bareContent.length < 2) {
      this.setState({ content: '' });
      return;
    }

    const content = encodeURIComponent(htmlContent);
    this.setState({ content });
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
   * Attempts to create a document.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptDocumentCreation(event) {
    event.preventDefault();

    // Needed because a form might be submitted without using the submit button.
    if (!this.hasValidTitle()) {
      this.setState({ errorMessage: 'Supply a title that has two or more characters that are not whitespace.' });
      return;
    }
    if (!this.hasValidContent()) {
      this.setState({ errorMessage: 'Supply document content that has two or more characters that are not whitespace.' });
      return;
    }
    if (!this.hasValidCategories()) {
      this.setState({ errorMessage: 'Add two or more comma-separated categories that aren\'t merely whitespace.' });
      return;
    }
    if (!this.hasValidTags()) {
      this.setState({ errorMessage: 'Please supply two or more comma-separated tags that aren\'t merely whitespace.' });
      return;
    }

    this.props.dispatch(createDocument(
      this.props.token,
      this.state.title,
      this.state.content,
      this.state.access,
      this.state.categories,
      this.state.tags
    ));
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    const isValidDocument = (
      this.hasValidTitle() &&
      this.hasValidContent() &&
      this.hasValidCategories() &&
      this.hasValidTags()
    );

    return (
      <div className="row">
        <form id="create-document-form">
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
              id="new-document-access"
              s={12}
              m={6}
              type="select"
              label="Access type"
              className="create-doc-select-access"
              defaultValue="public"
              onChange={this.updateAccess}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role">Role</option>
            </Input>
          </div>
          <Input
            id="new-document-title"
            s={12}
            className="create-doc-text-input"
            label="Title"
            type="text"
            onChange={this.updateTitle}
          >
            <Icon>title</Icon>
          </Input>
          <Input
            id="new-document-categories"
            s={12}
            className="create-doc-text-input"
            label="Categories"
            type="text"
            onChange={this.updateCategories}
          >
            <Icon>bookmark_border</Icon>
          </Input>
          <Input
            id="new-document-tags"
            s={12}
            className="create-doc-text-input"
            label="Tags"
            type="text"
            onChange={this.updateTags}
          >
            <Icon>label_outline</Icon>
          </Input>
          <span className="col s12">
            Document content<Icon left>mode_edit</Icon>
          </span>
          <br />
          <div className="col s12">
            <textarea id="create_doc_content_editor" />
            <br />
          </div>
          <div className="quarter-vertical-margin" />
          <Button
            id="create-document-btn"
            onClick={this.attemptDocumentCreation}
            modal="confirm"
            className={
              isValidDocument ?
              'quarter-vertical-margin' :
              'disabled quarter-vertical-margin'
            }
          >
            {this.props.modeMessage}
            <Icon left>note_add</Icon>
          </Button>
        </form>
        <div
          className={
            this.props.documentsStatus === 'creatingDocument' ?
            '' :
            'hide'
          }
        >
          <ProgressBar />
        </div>
      </div>
    );
  }
}

CreateDocument.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documentsStatus: PropTypes.string.isRequired,
  modeMessage: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default CreateDocument;
