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
const createDocumentEndpoint = '/api/documents';

describe('When POST\'ed to, the /api/documents endpoint', () => {
  const completeNewDocument = {
    title: `Spalaxicon${uuid.v4()}`,
    content: 'Sit dolor amet plavoy',
    access: 'public',
    categories: 'quuz',
    tags: 'qlat',
    authorId: 0
  };

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

  it('should reject requests where the title is missing', (done) => {
    const noTitle = {
      content: 'something',
      access: 'private',
      categories: 'random',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(noTitle)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter the title of your document.',
        error: 'MissingTitleError'
      }, done);
  });

  it('should reject requests where the title is invalid', (done) => {
    const invalidTitle = {
      title: '         ',
      content: 'something',
      access: 'private',
      categories: 'random',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(invalidTitle)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter a title with two or more non-whitespace characters.',
        error: 'InvalidTitleError'
      }, done);
  });

  it('should reject requests where the content is missing', (done) => {
    const noContent = {
      title: 'This is',
      access: 'private',
      categories: 'random',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(noContent)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter the content of your document.',
        error: 'MissingContentError'
      }, done);
  });

  it('should reject requests where the content is invalid', (done) => {
    const invalidContent = {
      title: 'This is',
      content: '       ',
      access: 'private',
      categories: 'random',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(invalidContent)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter a document content with two or more non-whitespace characters.',
        error: 'InvalidContentError'
      }, done);
  });

  it('should reject requests where the access type is missing', (done) => {
    const noAccessType = {
      title: 'This is',
      content: 'something',
      categories: 'random',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(noAccessType)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter an access type of \'public\', \'private\' or \'role\' for your document.',
        error: 'MissingAccessError'
      }, done);
  });

  it('should reject requests where the access type is invalid', (done) => {
    const invalidAccessType = {
      title: 'This is',
      content: 'something',
      access: 'foobar',
      categories: 'random',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(invalidAccessType)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter an access type of \'public\', \'private\' or \'role\' for your document.',
        error: 'InvalidAccessError'
      }, done);
  });

  it('should reject requests that have no categories', (done) => {
    const noCategories = {
      title: 'This is',
      content: 'something',
      access: 'private',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(noCategories)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter the categories of your document.',
        error: 'MissingCategoriesError'
      }, done);
  });

  it('should reject requests that have invalid categories ', (done) => {
    const invalidCategories = {
      title: 'This is',
      content: 'something',
      access: 'private',
      categories: '        ',
      tags: 'and awesome'
    };
    request.post(createDocumentEndpoint)
      .send(invalidCategories)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter categories with two or more non-whitespace characters.',
        error: 'InvalidCategoriesError'
      }, done);
  });

  it('should reject requests that have no tags', (done) => {
    const noTags = {
      title: 'This is',
      content: 'something',
      access: 'private',
      categories: 'random'
    };
    request.post(createDocumentEndpoint)
      .send(noTags)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter the tags of your document.',
        error: 'MissingTagsError'
      }, done);
  });

  it('should reject requests that have invalid tags ', (done) => {
    const invalidTags = {
      title: 'This is',
      content: 'something',
      access: 'private',
      categories: 'random',
      tags: '       '
    };
    request.post(createDocumentEndpoint)
      .send(invalidTags)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter tags with two or more non-whitespace characters.',
        error: 'InvalidTagsError'
      }, done);
  });

  it('should successfully create a valid, new document and return some of its attributes', (done) => {
    request.post(createDocumentEndpoint)
      .send(completeNewDocument)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', validToken)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.message).to.equal('Your document was successfully created.');
        expect(Array.isArray(res.body.documents)).to.equal(true);
        const createdDocument = res.body.documents[0];
        expect(createdDocument.title === completeNewDocument.title).to.equal(true);
        expect(createdDocument.content === completeNewDocument.content).to.equal(true);
        expect(createdDocument.access === completeNewDocument.access.toLowerCase()).to.equal(true);
        expect(createdDocument.categories === completeNewDocument.categories).to.equal(true);
        expect(createdDocument.tags === completeNewDocument.tags).to.equal(true);
        done();
      });
  });
});
