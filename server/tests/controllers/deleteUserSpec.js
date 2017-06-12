import supertest from 'supertest';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import JWT from 'jsonwebtoken';
import User from '../../models/User';
import app from '../../app';

dotenv.config();

const request = supertest(app);
const deleteUserEndpoint = '/api/users';

describe('When it receives a DELETE request, the /api/users endpoint', () => {
  const saltLength = Number(process.env.PASSWORD_SALT_LENGTH);
  const dummyUser = {
    firstName: 'Humpty',
    lastName: 'Dumpty',
    username: 'hdumpty@example.com',
    password: bcryptjs.hashSync('#1Twothree', saltLength),
    roleId: 0
  };

  let userId;

  // TODO: Investigate why, despite this before(), the it()s are run while
  // userId is still undefined.
  before('Create a sample user', (done) => {
    User
      .create(dummyUser)
      .then((user) => {
        userId = user.id;
        done();
      });
  });

  after('Remove the sample user used in this suite\'s specs', (done) => {
    User
      .destroy({
        where: {
          id: userId
        }
      })
      .then(() => {
        done();
      });
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

  it('should reject requests where the id of the user to delete is not' +
    ' supplied', (done) => {
    request.put(deleteUserEndpoint)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'UserIdNotSuppliedError'
      }, done);
  });

  it('should reject requests where the id of the user to delete is' +
    ' empty', (done) => {
    request.put(`${deleteUserEndpoint}?userId=`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'InvalidUserIdError'
      }, done);
  });

  it('should reject requests where the id of the user to delete is not' +
    ' numeric', (done) => {
    request.put(`${deleteUserEndpoint}?userId=foo`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'InvalidUserIdError'
      }, done);
  });

  it('should reject requests where no existing user has the id supplied', (done) => {
    request.put(`${deleteUserEndpoint}?userId=6543210`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .expect({
        error: 'TargetUserNotFoundError'
      }, done);
  });

  it('should reject requests where a non-admin user is trying to delete' +
  ' another user\'s account', (done) => {
    request.put(`${deleteUserEndpoint}?userId=0`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        error: 'ForbiddenOperationError'
      }, done);
  });

  it('should successfully delete a user\'s own account', (done) => {
    request.put(`${deleteUserEndpoint}?userId=0`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        error: 'ForbiddenOperationError'
      }, done);
  });
});
