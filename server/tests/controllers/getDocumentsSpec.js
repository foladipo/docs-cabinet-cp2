import supertest from 'supertest';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import chai from 'chai';
import app from '../../app';

dotenv.config();
const request = supertest(app);
const documentsEndpoint = '/api/documents';
const expect = chai.expect;

describe('When a user GET\'s it, the /api/documents endpoint', () => {
  it('should reject requests that don\'t have a JWT token', (done) => {
    request.get(documentsEndpoint)
      .expect(400)
      .expect({
        error: 'MissingTokenError'
      }, done);
  });

  it('should reject requests that have an invalid JWT token', (done) => {
    request.get(documentsEndpoint)
      .set('x-docs-cabinet-authentication', 'SOME_RANDOM_INCORRECT_TOKEN')
      .expect(401)
      .expect({
        error: 'InvalidTokenError'
      }, done);
  });

  const userDetails = {
    id: 0,
    username: 'foo@example.com',
    roleId: 0,
    firstName: 'Lagbaja',
    lastName: 'Anonymous'
  };
  const token = JWT.sign(userDetails, process.env.JWT_PRIVATE_KEY, { expiresIn: '3d' });
  it('should return a list of documents that have roles that\'re less than or' +
    ' equal to the roleId in the user\'s decoded token', (done) => {
    request.get(documentsEndpoint)
      .set('x-docs-cabinet-authentication', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.documents).to.not.equal(undefined);
        expect(Array.isArray(res.body.documents)).to.equal(true);
        done();
      });
  });
});
