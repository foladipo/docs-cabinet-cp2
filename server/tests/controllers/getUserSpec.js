import supertest from 'supertest';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import chai from 'chai';
import User from '../../models/User';
import app from '../../app';

dotenv.config();
const expect = chai.expect;

const request = supertest(app);
const getUserEndpoint = '/api/users';

describe('When it receives a GET request, the /api/users/<id> endpoint', () => {
  const regularUserProfile = {
    id: 0,
    firstName: 'Lagbaja',
    lastName: 'Anonymous',
    username: 'foo@example.com',
    roleId: 0
  };

  const adminUserProfile = {
    id: Number(process.env.DEFAULT_ADMIN_USER_USERID),
    firstName: process.env.DEFAULT_ADMIN_USER_FIRSTNAME,
    lastName: process.env.DEFAULT_ADMIN_USER_LASTNAME,
    username: process.env.DEFAULT_ADMIN_USER_USERNAME,
    roleId: process.env.DEFAULT_ADMIN_USER_ROLEID
  };

  const saltLength = Number(process.env.PASSWORD_SALT_LENGTH);
  const dummyUser = {
    firstName: 'Humpty',
    lastName: 'Dumpty',
    username: 'hdumpty@example.com',
    password: bcryptjs.hashSync('#1Twothree', saltLength),
    roleId: 0
  };

  let targetUserId;

  before('Create a sample user', (done) => {
    User
      .create(dummyUser)
      .then((user) => {
        targetUserId = user.id;
        done();
      });
  });

  after('Remove the sample user used in this suite\'s specs', (done) => {
    User
      .destroy({
        where: {
          id: targetUserId
        }
      })
      .then(() => {
        done();
      });
  });

  const regularUserToken = JWT.sign(
    regularUserProfile,
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '3d' }
  );
  it('should reject requests from non-admin users', (done) => {
    request.get(getUserEndpoint)
      .set('x-docs-cabinet-authentication', regularUserToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        message: 'Sorry, you\'re not permitted to perform this action.',
        error: 'ForbiddenOperationError'
      }, done);
  });

  const validToken = JWT.sign(
    adminUserProfile,
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '3d' }
  );
  it('should reject requests where the target user id is invalid', (done) => {
    request.get(`${getUserEndpoint}/INVALID_ID`)
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
    request.get(`${getUserEndpoint}/6543210`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .expect({
        message: 'The account you asked for doesn\'t exist.',
        error: 'TargetUserNotFoundError'
      }, done);
  });

  it('should successfully retrieve a single user\'s profile', (done) => {
    request.get(`${getUserEndpoint}/${targetUserId}`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.users).to.not.equal(undefined);
        expect(Array.isArray(res.body.users)).to.equal(true);
        expect(res.body.users.length).to.equal(1);
        done();
      });
  });
});
