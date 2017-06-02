import supertest from 'supertest';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../../app';

dotenv.config();

const request = supertest(app);
const logoutEndpoint = '/api/users/logout';

describe('When POST\'ed to, the /api/users/logout endpoint', () => {
  it('should reject requests where the token header is missing', (done) => {
    request.post(logoutEndpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'MissingTokenError'
      }, done);
  });

  const emptyToken = '';
  it('should reject requests where the token header is empty', (done) => {
    request.post(logoutEndpoint)
      .set('x-docs-cabinet-authentication', emptyToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'EmptyTokenError'
      }, done);
  });

  const invalidToken = 'AN_INVALID_TOKEN';
  it('should reject requests where the token supplied is invalid', (done) => {
    request.post(logoutEndpoint)
      .set('x-docs-cabinet-authentication', invalidToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        error: 'InvalidTokenError'
      }, done);
  });

  // This token expires after 1ms.
  const payload = {
    random: 'stuff'
  };
  const expiredToken = JWT.sign(
    payload,
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '1' }
  );
  it('should reject requests where the token supplied has expired', (done) => {
    request.post(logoutEndpoint)
      .set('x-docs-cabinet-authentication', expiredToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        error: 'ExpiredTokenError'
      }, done);
  });

  const user = {
    userId: 0,
    username: 'foo@example.com',
    roleId: 0,
    firstName: 'Lagbaja',
    lastName: 'Anonymous'
  };
  const validToken = JWT.sign(
    user,
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '3d' }
  );
  it('should logout users when a valid token is supplied', (done) => {
    request.post(logoutEndpoint)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'LogoutSucceeded'
      }, done);
  });
});
