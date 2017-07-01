import supertest from 'supertest';
import chai from 'chai';
import bcryptjs from 'bcryptjs';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import uuid from 'uuid';
import Document from '../../models/Document';
import User from '../../models/User';
import app from '../../app';

dotenv.config();
const expect = chai.expect;

const request = supertest(app);
const searchUsersEndpoint = '/api/search/users';

describe('When it receives a GET request, the /api/search/users endpoint', () => {
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

  after('Delete the sample user', (done) => {
    User
      .destroy({
        where: {
          username: dummyUser.username
        }
      })
      .then(() => done());
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

  it('should reject requests that don\'t specify a valid token', (done) => {
    request.get(searchUsersEndpoint)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'We don\'t recognize you. Please send your identification token with the next request.',
        error: 'MissingTokenError'
      }, done);
  });

  it('should reject requests that don\'t specify a search query', (done) => {
    request.get(searchUsersEndpoint)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', getValidToken())
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Yikes! You didn\'t supply a search query.',
        error: 'UserQueryNotSuppliedError'
      }, done);
  });

  it('should return a list of users when the search query is part of their first name, last name or username', (done) => {
    request.get(`${searchUsersEndpoint}?q=xampl`)
      .set('Accept', 'application/json')
      .set('x-docs-cabinet-authentication', getValidToken())
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);

        const resBody = res.body;
        expect(resBody.message).to.equal('Users found.');
        expect(Array.isArray(resBody.users)).to.equal(true);
        expect(resBody.users.length > 0).to.equal(true);
        done();
      });
  });
});
