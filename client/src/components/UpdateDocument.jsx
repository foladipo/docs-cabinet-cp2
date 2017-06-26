import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input } from 'react-materialize';
import * as DocumentActions from '../actions/DocumentActions';

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
      access: props.access,
      docContent: props.docContent,
      title: props.title
    };

    this.hasValidAccess = this.hasValidAccess.bind(this);
    this.hasValidTitle = this.hasValidTitle.bind(this);
    this.hasValidDocContent = this.hasValidDocContent.bind(this);
    this.updateAccess = this.updateAccess.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.submitUpdate = this.submitUpdate.bind(this);
  }

  /**
   * Tests the validity of a document's access type.
   * @return {Boolean} - Whether or not a document's access type is valid.
   */
  hasValidAccess() {
    const access = this.state.access;
    if (!access) return false;
    const knownAccessTypes = ['public', 'private', 'role'];
    return knownAccessTypes.indexOf(access) > -1;
  }

  /**
   * Tests the validity of a document's title.
   * @return {Boolean} - Whether or not a document's title is valid.
   */
  hasValidTitle() {
    const title = this.state.title;
    if (!title) return false;
    const strippedTitle = title.replace(/(\s+)/, '');
    return strippedTitle.length > 0;
  }

  /**
   * Tests the validity of a document's content.
   * @return {Boolean} - Whether or not a document's content is valid.
   */
  hasValidDocContent() {
    const docContent = this.state.docContent;
    if (!docContent) return false;
    const strippedDocContent = docContent.replace(/(\s+)/, '');
    return strippedDocContent.length > 0;
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
  handleEditorChange(event) {
    this.setState({ docContent: event.target.value });
  }

  /**
   * Attempts to update or create a document.
   * @param {JqueryEvent} event - Info about the event that occurred on the
   * DOM element this is attached to.
   * @return {null} - Returns nothing.
   */
  submitUpdate(event) {
    event.preventDefault();

    const access = this.state.access;
    if (!this.hasValidAccess(access)) {
      this.setState({ errorMessage: 'Please choose a valid access type.' });
      return;
    }
    const title = this.state.title;
    if (!this.hasValidTitle(title)) {
      this.setState({ errorMessage: 'Supply a title that has one or more characters that are not whitespace.' });
      return;
    }
    const docContent = this.state.docContent;
    if (!this.hasValidDocContent(docContent)) {
      this.setState({ errorMessage: 'Supply a document content that has one or more characters that are not whitespace.' });
      return;
    }

    if (this.props.mode === 'create') {
      this.props.dispatch(DocumentActions.createDocument(
        this.props.user.token,
        this.state.title,
        this.state.docContent,
        this.state.access,
        'foo',
        'bar'
      ));
    }
  }

  /**
   * @return {Component|null} - Returns the React Component to be rendered or
   * null if nothing is to be rendered.
   */
  render() {
    // TODO: isValidDocument works fine, but why do these all become true once one of them is?
    const isValidDocument = (this.hasValidAccess(this.state.access) &&
      this.hasValidTitle(this.state.title) &&
      this.hasValidDocContent(this.state.docContent));

    return (
      <div className="row">
        <form>
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
              defaultValue="public"
              onChange={this.updateAccess}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="role">Role</option>
            </Input>
          </div>
          <Input s={12} label="Title" type="text" onChange={this.updateTitle}>
            <Icon>title</Icon>
          </Input>
          <span className="col s12">Document content<Icon left>mode_edit</Icon></span>
          <br />
          <div className="col s12">
            <textarea
              rows="10"
              onChange={this.handleEditorChange}
            />
            <br />
          </div>
          <Button onClick={this.submitUpdate} modal="confirm" className={isValidDocument ? '' : 'disabled'}>
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
  access: PropTypes.string,
  dispatch: PropTypes.func,
  docContent: PropTypes.string,
  mode: PropTypes.string,
  modeMessage: PropTypes.string,
  user: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string
};

UpdateDocument.defaultProps = {
  access: undefined,
  dispatch: undefined,
  docContent: undefined,
  mode: undefined,
  modeMessage: undefined,
  user: {},
  title: undefined
};

export default UpdateDocument;
