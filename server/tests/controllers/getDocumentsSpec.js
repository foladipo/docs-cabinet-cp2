import supertest from 'supertest';
import chai from 'chai';
import app from '../../app';

const request = supertest(app);
const documentsEndpoint = '/api/documents';
const expect = chai.expect;

describe('When a user GET\'s it, the /api/documents endpoint', () => {
  it('should reject requests that don\'t have a JWT token', (done) => {
    request.get(documentsEndpoint)
      .expect(401)
      .expect({
        error: 'MissingTokenError'
      }, done);
  });

  it('should reject requests that have an invalid JWT token', (done) => {
    request.get(documentsEndpoint)
      .send('X-Docs-Cabinet-Authentication', 'token SOME_RANDOM_INCORRECT_TOKEN')
      .expect(401)
      .expect({
        error: 'InvalidTokenError'
      }, done);
  });

  it('should return a list of documents that have roles that\'re less than or' +
    ' equal to the roleId in the user\'s decoded token', (done) => {
    request.get(documentsEndpoint)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.documents).to.not.equal(undefined);
        expect(typeof res.body.documents).to.equal('array');
      });
  });
});
