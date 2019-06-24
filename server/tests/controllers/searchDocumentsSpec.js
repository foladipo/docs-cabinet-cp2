import supertest from 'supertest';
import chai from 'chai';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import uuid from 'uuid';
import { DEFAULT_REGULAR_USER } from '../../constants';
import { Document } from '../../models/';
import app from '../../app';

dotenv.config();
const expect = chai.expect;

const request = supertest(app);
const searchDocumentsEndpoint = '/api/search/documents';

describe('When it receives a GET request, the /api/search/documents endpoint', () => {
  const completeNewDocument = {
    title: `Spalaxicon${uuid.v4()}`,
    content: 'Sit dolor amet plavoy',
    access: 'public',
    categories: 'quuz',
    tags: 'qlat',
    authorId: 0
  };

  before('Create the sample document to be used in this suite\'s specs', (done) => {
    Document
      .create(completeNewDocument)
      .then(() => {
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

  it('should return an error for requests that don\'t specify a valid token', (done) => {
    request.get(searchDocumentsEndpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'We don\'t recognize you. Please send your identification token with the next request.',
        error: 'MissingTokenError'
      }, done);
  });

  it('should return an error for requests that don\'t specify a search query', (done) => {
    request.get(searchDocumentsEndpoint)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Yikes! You didn\'t supply a search query.',
        error: 'DocumentQueryNotSuppliedError'
      }, done);
  });

  it('should successfully get a list of documents for valid searches', (done) => {
    request.get(`${searchDocumentsEndpoint}?q=laxic`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        const resBody = res.body;
        expect(resBody.message).to.equal('Documents found.');
        expect(Array.isArray(resBody.documents)).to.equal(true);
        expect(resBody.documents.length > 0).to.equal(true);
        done();
      });
  });
});
