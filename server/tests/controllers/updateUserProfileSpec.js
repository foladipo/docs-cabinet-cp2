import supertest from 'supertest';
import JWT from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../../models/User';
import app from '../../app';

dotenv.config();

const request = supertest(app);
const updateUserProfileEndpoint = '/api/users/';

describe('When it receives a PUT request, the /api/users endpoint', () => {
  const saltLength = Number.parseInt(process.env.PASSWORD_SALT_LENGTH, 10);
  const dummyUser = {
    firstName: 'Humpty',
    lastName: 'Dumpty',
    username: 'hdumpty@example.com',
    password: bcryptjs.hashSync('#1Twothree', saltLength),
    roleId: 0
  };

  let userId;

  const newFirstName = 'Bruce';
  const newLastName = 'Banner';
  const newUsername = 'angry@example.com';
  const newPassword = bcryptjs.hashSync('$1Billards', saltLength);

  before('Create a dummy user', (done) => {
    User
      .create(dummyUser)
      .then((user) => {
        userId = user.id;
        done();
      });
  });

  after('Delete the dummy user', (done) => {
    User
      .destroy({
        where: {
          username: [dummyUser.username, newUsername]
        }
      })
      .then(() => done());
  });

  it('should reject requests where the token header is missing', (done) => {
    request.put(updateUserProfileEndpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'MissingTokenError'
      }, done);
  });

  const emptyToken = '';
  it('should reject requests where the token header is empty', (done) => {
    request.put(updateUserProfileEndpoint)
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
    request.put(updateUserProfileEndpoint)
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
    request.put(updateUserProfileEndpoint)
      .set('x-docs-cabinet-authentication', expiredToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        error: 'ExpiredTokenError'
      }, done);
  });

  const userProfile = {
    userId,
    username: dummyUser.username,
    roleId: dummyUser.roleId,
    firstName: dummyUser.firstName,
    lastName: dummyUser.lastName
  };
  const validToken = JWT.sign(
    userProfile,
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '3d' }
  );
  it('should ensure that the user is authorized to perform this operation',
    (done) => {
      request.put(updateUserProfileEndpoint)
      .send({ username: 'another.user@example.com' })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        error: 'ExpiredTokenError'
      }, done);
    });

  it('should successfully update a user\'s first name', (done) => {
    request.put(updateUserProfileEndpoint)
      .send({ firstName: newFirstName })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'UpdateSucceeded'
      }, done);
  });

  it('should successfully update a user\'s last name', (done) => {
    request.put(updateUserProfileEndpoint)
      .send({ lastName: newLastName })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'UpdateSucceeded'
      }, done);
  });

  it('should successfully update a user\'s email', (done) => {
    request.put(updateUserProfileEndpoint)
      .send({ username: newUsername })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'UpdateSucceeded'
      }, done);
  });

  it('should successfully update a user\'s password', (done) => {
    request.put(updateUserProfileEndpoint)
      .send({ password: newPassword })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'UpdateSucceeded'
      }, done);
  });
});
