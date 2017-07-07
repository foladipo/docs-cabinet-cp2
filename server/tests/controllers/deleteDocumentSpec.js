import supertest from 'supertest';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import uuid from 'uuid';
import { DEFAULT_REGULAR_USER } from '../../constants';
import { Document } from '../../models/';
import app from '../../app';

dotenv.config();

const request = supertest(app);
const deleteDocumentEndpoint = '/api/documents';

describe('When it gets a DELETE request, the /api/documents endpoint', () => {
  const completeNewDocument = {
    title: `Spalaxicon${uuid.v4()}`,
    content: 'Sit dolor amet plavoy',
    access: 'public',
    categories: 'quuz',
    tags: 'qlat',
    authorId: 0
  };

  let id;

  before('Create the sample document to be used in this suite\'s specs', (done) => {
    Document
      .create(completeNewDocument)
      .then((doc) => {
        id = doc.id;
        done();
      });
  });

  after('Remove the sample document used in this suite\'s specs', (done) => {
    Document
      .destroy({ where: { title: completeNewDocument.title } })
      .then(() => {
        done();
      });
  });

  const validToken = JWT.sign(
    DEFAULT_REGULAR_USER,
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '3d' }
  );

  it('should show the default API message for requests that don\'t specify the id of the document to be deleted', (done) => {
    request.delete(deleteDocumentEndpoint)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'Welcome to Docs Cabinet. File away!'
      }, done);
  });

  it('should reject requests that specify an invalid id for the document to be deleted', (done) => {
    request.delete(`${deleteDocumentEndpoint}/foo`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'The document id you supplied is not a number.',
        error: 'InvalidTargetDocumentIdError'
      }, done);
  });

  it('should reject requests that try to delete a non-existent document', (done) => {
    request.delete(`${deleteDocumentEndpoint}/6543210`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(404)
      .expect({
        message: 'The document you tried to delete doesn\'t exist.',
        error: 'TargetDocumentNotFoundError'
      }, done);
  });

  it('should successfully delete a document', (done) => {
    request.delete(`${deleteDocumentEndpoint}/${id}`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'Document deleted.'
      }, done);
  });
});
