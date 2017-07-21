import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Icon, Input, ProgressBar, Row } from 'react-materialize';
import _ from 'lodash';
import striptags from 'striptags';
import { getDocument, updateDocument } from '../../actions/DocumentActions';

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

    this.attemptDocumentUpdate = this.attemptDocumentUpdate.bind(this);
  }

  /**
   * Called immediately after this Component is mounted.
   * @return {null} - Returns nothing.
   */
  componentDidMount() {
    CKEDITOR.replace('update_content_editor');
    CKEDITOR.instances.update_content_editor.on('change', this.updateContent);

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

      CKEDITOR.instances.update_content_editor.setData(
        decodeURIComponent(targetDocument.content)
      );

      return;
    }

    if (nextProps.documents.status === 'documentUpdated') {
      const targetDocumentId = this.state.targetDocument.id;
      const targetDocumentInArray =
        nextProps.documents.userDocuments.documents.filter(doc =>
          doc.id === targetDocumentId
        );
      const targetDocument = targetDocumentInArray[0];
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
      this.props.documents.userDocuments.documents.filter(
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

      CKEDITOR.instances.update_content_editor.setData(
        decodeURIComponent(targetDocument.content)
      );

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
    const title = event.target.value;
    if (typeof title !== 'string' || title.length < 2) {
      this.setState({ title: this.state.targetDocument.title });
      return;
    }

    this.setState({ title });
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
   * @return {null} - Returns nothing.
   */
  updateContent() {
    const htmlContent = CKEDITOR.instances.update_content_editor.getData();
    const bareContent = striptags(htmlContent);
    if (bareContent.length < 2) {
      this.setState({ content: this.state.targetDocument.content });
      return;
    }

    const content = encodeURIComponent(htmlContent);
    this.setState({ content });
  }

  /**
   * Tests the validity of a document's content.
   * @return {Boolean} - Whether or not a document's content is valid.
   */
  hasValidContent() {
    const htmlContent = decodeURIComponent(this.state.content);
    const bareContent = striptags(htmlContent);
    if (!bareContent) return false;

    const contentWithoutWhitespace = bareContent.replace(/(\s+)/, '');
    return contentWithoutWhitespace.length > 1;
  }

  /**
   * Updates the categories stored in this Component's state.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  updateCategories(event) {
    const categories = event.target.value;
    if (typeof categories !== 'string' || categories.length < 2) {
      this.setState({ categories: this.state.targetDocument.categories });
      return;
    }

    this.setState({ categories });
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
    const tags = event.target.value;
    if (typeof tags !== 'string' || tags.length < 2) {
      this.setState({ tags: this.state.targetDocument.tags });
      return;
    }

    this.setState({ tags });
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
      this.hasValidTitle() &&
      this.hasValidContent() &&
      this.hasValidCategories() &&
      this.hasValidTags()
    );
  }

  /**
   * Attempts to update or create a document.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  attemptDocumentUpdate(event) {
    event.preventDefault();

    // Needed because a form might be submitted without using the submit button.
    if (!this.hasValidTitle()) {
      this.setState({
        errorMessage: 'Supply a title that has two or more characters that are not whitespace.'
      });
      return;
    }
    if (!this.hasValidContent()) {
      this.setState({
        errorMessage: 'Supply a document content that has two or more characters that are not whitespace.'
      });
      return;
    }
    if (!this.hasValidCategories()) {
      this.setState({
        errorMessage: 'Add two or more comma-separated categories that aren\'t merely whitespace.'
      });
      return;
    }
    if (!this.hasValidTags()) {
      this.setState({
        errorMessage: 'Please supply two or more comma-separated tags that aren\'t merely whitespace.'
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
    if (
      this.props.documents.status !== 'updatingDocument' &&
      this.props.documents.status !== 'updateDocumentFailed'
    ) {
      $('#update-access').val(
        this.state.access || this.state.targetDocument.access
      );
    }

    return (
      <div id="update-document-page" className="row scrollable-page">
        <div className="centered-wrapper">
          <div className="msg-container">
            <h5
              className={
                this.props.documents.status === 'documentUpdated' ?
                'success-msg teal lighten-2 white-text center' :
                'hide success-msg'
              }
            >
              {this.props.documents.statusMessage}
            </h5>
            <h5
              className={
                this.props.documents.status === 'getDocumentFailed' ||
                this.props.documents.status === 'updateDocumentFailed' ?
                'error-msg red white-text center' :
                'hide error-msg'
              }
            >
              {this.props.documents.statusMessage}
            </h5>
            <h5
              className={
                !(this.isValidDocument() && this.isUpdate()) ?
                'error-msg red white-text center' :
                'hide error-msg'
              }
            >
              {this.state.errorMessage}
            </h5>
          </div>
          <h4>Update document</h4>
          <div className="divider" />
          <form
            id="update-document-form"
            className={this.state.hasValidTargetDocumentId ? '' : 'hide'}
          >
            <Row>
              <Col s={12}>
                <h6 className="red-text text-lighten-2">
                  **All fields are required.
                </h6>
              </Col>
              <Col s={12} m={5}>
                <Col s={12}>
                  <span className="col s12 green-label">
                    Access types
                  </span>
                  <Input
                    id="update-access"
                    s={7}
                    type="select"
                    onChange={this.updateAccess}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="role">Role</option>
                  </Input>
                </Col>
                <Col s={12}>
                  <span className="green-label">Title</span>
                  <Input
                    id="update-title"
                    s={12}
                    type="text"
                    placeholder={
                      this.state.targetDocument ?
                      this.state.targetDocument.title : ''
                    }
                    onChange={this.updateTitle}
                  >
                    <Icon>title</Icon>
                  </Input>
                </Col>
                <Col s={12}>
                  <span className="green-label">Categories</span>
                  <Input
                    id="update-categories"
                    s={12}
                    type="text"
                    placeholder={
                      this.state.targetDocument ?
                      this.state.targetDocument.categories : ''
                    }
                    onChange={this.updateCategories}
                  >
                    <Icon>bookmark_border</Icon>
                  </Input>
                </Col>
                <Col s={12}>
                  <span className="green-label">Tags</span>
                  <Input
                    id="update-tags"
                    s={12}
                    type="text"
                    placeholder={
                      this.state.targetDocument ?
                      this.state.targetDocument.tags : ''
                    }
                    onChange={this.updateTags}
                  >
                    <Icon>label_outline</Icon>
                  </Input>
                </Col>
              </Col>
              <Col s={12} m={7}>
                <Col s={12}>
                  <br />
                  <span className="green-label">Content</span>
                  <Icon left>mode_edit</Icon>
                  <div className="col s12">
                    <textarea
                      id="update_content_editor"
                      onChange={this.updateContent}
                    />
                    <br />
                  </div>
                </Col>
              </Col>
              <Col s={12}>
                <div className="quarter-vertical-margin" />
                <Button
                  id="update-document-btn"
                  onClick={this.attemptDocumentUpdate}
                  className={
                    this.isValidDocument() && this.isUpdate() ?
                    'quarter-vertical-margin' :
                    'disabled quarter-vertical-margin'
                  }
                >
                  Update
                  <Icon left>update</Icon>
                </Button>
              </Col>
            </Row>
          </form>
          <div
            className={
              this.props.documents.status === 'updatingDocument' ?
              '' :
              'hide'
            }
          >
            <ProgressBar />
          </div>
        </div>
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
