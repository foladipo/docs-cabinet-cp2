import supertest from 'supertest';
import chai from 'chai';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import uuid from 'uuid';
import { DEFAULT_REGULAR_USER } from '../../constants';
import Document from '../../models/Document';
import app from '../../app';

dotenv.config();
const expect = chai.expect;

const request = supertest(app);
const updateDocumentEndpoint = '/api/documents';

describe('When PUT to, the /api/documents endpoint', () => {
  const completeNewDocument = {
    title: `Spalaxicon${uuid.v4()}`,
    content: 'Sit dolor amet plavoy',
    access: 'public',
    categories: 'quuz',
    tags: 'qlat',
    createdBy: 0
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

  it('should show the default API message for requests that don\'t specify the id of the document to be updated', (done) => {
    request.put(updateDocumentEndpoint)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'Welcome to Docs Cabinet. File away!'
      }, done);
  });

  it('should reject requests that specify an invalid id for the document to be updated', (done) => {
    request.put(`${updateDocumentEndpoint}/foo`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'The document id you supplied is not a number.',
        error: 'InvalidTargetDocumentIdError'
      }, done);
  });

  it('should reject requests that do not specify anything to be updated', (done) => {
    const noUpdate = {};
    request.put(`${updateDocumentEndpoint}/${id}`)
      .send(noUpdate)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'You didn\'t supply any info for the update.',
        error: 'EmptyDocumentBodyError'
      }, done);
  });

  it('should successfully update a document\'s title', (done) => {
    const titleUpdate = { title: 'New title' };
    request.put(`${updateDocumentEndpoint}/${id}`)
      .send(titleUpdate)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const resBody = res.body;
        expect(resBody.message).to.equal('Document updated.');
        expect(Array.isArray(resBody.documents)).to.equal(true);
        expect(resBody.documents[0].title).to.equal(titleUpdate.title);
        done();
      });
  });

  it('should successfully update a document\'s content', (done) => {
    const contentUpdate = { content: 'New content' };
    request.put(`${updateDocumentEndpoint}/${id}`)
      .send(contentUpdate)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const resBody = res.body;
        expect(resBody.message).to.equal('Document updated.');
        expect(Array.isArray(resBody.documents)).to.equal(true);
        expect(resBody.documents[0].content).to.equal(contentUpdate.content);
        done();
      });
  });

  it('should successfully update a document\'s access type', (done) => {
    const accessUpdate = { access: 'role' };
    request.put(`${updateDocumentEndpoint}/${id}`)
      .send(accessUpdate)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const resBody = res.body;
        expect(resBody.message).to.equal('Document updated.');
        expect(Array.isArray(resBody.documents)).to.equal(true);
        expect(resBody.documents[0].access).to.equal(accessUpdate.access);
        done();
      });
  });

  it('should successfully update a document\'s categories', (done) => {
    const categoriesUpdate = { categories: 'New categories' };
    request.put(`${updateDocumentEndpoint}/${id}`)
      .send(categoriesUpdate)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const resBody = res.body;
        expect(resBody.message).to.equal('Document updated.');
        expect(Array.isArray(resBody.documents)).to.equal(true);
        expect(resBody.documents[0].categories).to.equal(categoriesUpdate.categories);
        done();
      });
  });

  it('should successfully update a document\'s tags', (done) => {
    const tagsUpdate = { tags: 'New tags' };
    request.put(`${updateDocumentEndpoint}/${id}`)
      .send(tagsUpdate)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const resBody = res.body;
        expect(resBody.message).to.equal('Document updated.');
        expect(Array.isArray(resBody.documents)).to.equal(true);
        expect(resBody.documents[0].tags).to.equal(tagsUpdate.tags);
        done();
      });
  });
});
