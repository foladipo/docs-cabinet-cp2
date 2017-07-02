import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Preloader, Row } from 'react-materialize';
import { fetchUserDocuments } from '../actions/DocumentActions';
import Document from './Document';

// TODO: This will probably become a stateful Component, especially because of LIMIT and OFFSET.

/**
 * DashboardPage - Renders the main elements of the dashboard.
 * @param {Object} props - The data passed to this component from its parent.
 * @return {Component|null} - Returns the React Component to be rendered or
 * null if nothing is to be rendered.
 */
export default function DashboardPage(props) {
  const showStatusMessage = props.documents.status === 'fetchingDocuments' ||
    props.documents.status === 'documentsFetchFailed';

  const documentsComponents = props.documents.documents.map(doc => (
    <Document
      key={doc.id}
      dispatch={props.dispatch}
      token={props.user.token}
      documentsStatus={props.documents.status}
      targetDocument={props.documents.targetDocument}
      {...doc}
    />
  ));

  const LIMIT = 30;
  const OFFSET = 0;

  const startDocumentsFetch = () => {
    props.dispatch(fetchUserDocuments(
      props.user.token,
      props.user.user.id,
      LIMIT,
      OFFSET
    ));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h3>Welcome to your dashboard!</h3>
        <h5 className={showStatusMessage ? '' : 'hide'}>{props.documents.statusMessage}</h5>
        <Row className={props.documents.status === 'fetchingDocuments' ? '' : 'hide'}>
          <Col s={4} offset="s4">
            <Preloader size="big" flashing />
          </Col>
        </Row>
        <Button
          onClick={startDocumentsFetch}
          className={props.documents.status === 'documentsFetchFailed' ? '' : 'hide'}
        >
          {props.documents.statusMessage}
        </Button>
      </div>
      <div className={props.documents.documents.length < 1 ? '' : 'hide'}>
        <h5 className="teal lighten-2 white-text center">
          You don&rsquo;t have any documents. Please create some.
        </h5>
      </div>
      <div className="dashboard-documents row">{documentsComponents}</div>
    </div>
  );
}


DashboardPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  documents: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired
};
