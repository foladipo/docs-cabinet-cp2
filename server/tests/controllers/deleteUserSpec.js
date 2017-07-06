import supertest from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { User } from '../../models/';
import app from '../../app';

dotenv.config();

const request = supertest(app);
const expect = chai.expect;
const deleteUserEndpoint = '/api/users';

describe('When it receives a DELETE request, the /api/users/<id> endpoint', () => {
  const saltLength = Number(process.env.PASSWORD_SALT_LENGTH);
  const dummyUser = {
    firstName: 'Humpty',
    lastName: 'Dumpty',
    username: 'hdumpty@example.com',
    password: bcryptjs.hashSync('#1Twothree', saltLength),
    roleId: 0
  };

  let id;

  before('Create a sample user', (done) => {
    User
      .create(dummyUser)
      .then((user) => {
        id = user.id;
        done();
      });
  });

  after('Remove the sample user used in this suite\'s specs', (done) => {
    User
      .destroy({ where: { id } })
      .then(() => {
        done();
      });
  });

  const getValidToken = () => {
    const userProfile = {
      id,
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

    return validToken;
  };

  it('should show the default API message for requests where the id of the user to delete is' +
    ' empty', (done) => {
    const validToken = getValidToken();
    request.delete(`${deleteUserEndpoint}/`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'Welcome to Docs Cabinet. File away!'
      }, done);
  });

  it('should reject requests where the id of the user to delete is not' +
    ' numeric', (done) => {
    const validToken = getValidToken();
    request.delete(`${deleteUserEndpoint}/foo`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'The user id you supplied is not a number.',
        error: 'InvalidTargetUserIdError'
      }, done);
  });

  it('should reject requests where no existing user has the id supplied', (done) => {
    const validToken = getValidToken();
    request.delete(`${deleteUserEndpoint}/6543210`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        message: 'Sorry, you\'re not permitted perform this action.',
        error: 'ForbiddenOperationError'
      }, done);
  });

  it('should reject requests where a non-admin user is trying to delete' +
  ' another user\'s account', (done) => {
    const validToken = getValidToken();
    request.delete(`${deleteUserEndpoint}/0`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        message: 'Sorry, you\'re not permitted perform this action.',
        error: 'ForbiddenOperationError'
      }, done);
  });

  it('should successfully delete a user\'s own account', (done) => {
    const validToken = getValidToken();
    request.delete(`${deleteUserEndpoint}/${id}`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        expect(res.body.message).to.equal('We hate to see you go! But your account was successfully deleted.');
        expect(Array.isArray(res.body.users)).to.equal(true);
        const deletedUser = res.body.users[0];
        expect(deletedUser.username).to.equal(dummyUser.username);
        done();
      });
  });
});
