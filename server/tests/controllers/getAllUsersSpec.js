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
const getAllUsersEndpoint = '/api/users';

describe('When it receives a GET request, the /api/users endpoint', () => {
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
    request.get(getAllUsersEndpoint)
      .set('x-docs-cabinet-authentication', regularUserToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        error: 'ForbiddenOperationError'
      }, done);
  });

  const validToken = JWT.sign(
    adminUserProfile,
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: '3d' }
  );
  it('should successfully retrieve a list of this app\'s users', (done) => {
    request.get(getAllUsersEndpoint)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.users).to.not.equal(undefined);
        expect(Array.isArray(res.body.users)).to.equal(true);
        expect(res.body.users.length > 0).to.equal(true);
        done();
      });
  });
});
