import supertest from 'supertest';
import chai from 'chai';
import JWT from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../../models/User';
import app from '../../app';

dotenv.config();

const expect = chai.expect;

const request = supertest(app);
const updateUserProfileEndpoint = '/api/users';

describe('When it receives a PUT request, the /api/users endpoint', () => {
  const saltLength = Number(process.env.PASSWORD_SALT_LENGTH);
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

  before('Create a sample user', (done) => {
    User
      .create(dummyUser)
      .then((user) => {
        userId = user.id;
        done();
      });
  });

  after('Delete the sample user', (done) => {
    User
      .destroy({
        where: {
          username: [dummyUser.username, newUsername]
        }
      })
      .then(() => done());
  });

  const getValidToken = () => {
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

    return validToken;
  };

  it('should reject requests where the token header is missing', (done) => {
    request.put(`${updateUserProfileEndpoint}/foo`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'MissingTokenError'
      }, done);
  });

  it('should reject requests where the token header is empty', (done) => {
    const emptyToken = '';
    request.put(`${updateUserProfileEndpoint}/foo`)
      .set('x-docs-cabinet-authentication', emptyToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'EmptyTokenError'
      }, done);
  });

  it('should reject requests where the token supplied is invalid', (done) => {
    const invalidToken = 'AN_INVALID_TOKEN';
    request.put(`${updateUserProfileEndpoint}/foo`)
      .set('x-docs-cabinet-authentication', invalidToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        error: 'InvalidTokenError'
      }, done);
  });

  it('should reject requests where the token supplied has expired', (done) => {
    // This token expires after 1ms.
    const payload = {
      random: 'stuff'
    };
    const expiredToken = JWT.sign(
      payload,
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: '1' }
    );
    request.put(`${updateUserProfileEndpoint}/foo`)
      .set('x-docs-cabinet-authentication', expiredToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .expect({
        error: 'ExpiredTokenError'
      }, done);
  });

  it('should show the default API message for requests where the id of the user to delete is' +
    ' empty', (done) => {
    const validToken = getValidToken();
    request.put(`${updateUserProfileEndpoint}/`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        message: 'Welcome to Docs Cabinet. File away!'
      }, done);
  });

  it('should reject requests where the id of the user to update is not numeric', (done) => {
    const validToken = getValidToken();
    request.put(`${updateUserProfileEndpoint}/foo`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'InvalidUserIdError'
      }, done);
  });

  it('should reject requests where a non-admin user is trying to delete another user\'s account', (done) => {
    const validToken = getValidToken();
    request.put(`${updateUserProfileEndpoint}/6543210`)
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(403)
      .expect({
        error: 'ForbiddenOperationError'
      }, done);
  });

  it('should successfully update a user\'s first name', (done) => {
    const validToken = getValidToken();
    request.put(`${updateUserProfileEndpoint}/${userId}`)
      .send({ firstName: newFirstName })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw new Error(err);
        const body = res.body;
        expect(Array.isArray(body.users)).to.equal(true);
        expect(body.users[0].firstName).to.equal(newFirstName);
        done();
      });
  });

  it('should successfully update a user\'s last name', (done) => {
    const validToken = getValidToken();
    request.put(`${updateUserProfileEndpoint}/${userId}`)
      .send({ lastName: newLastName })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw new Error(err);
        const body = res.body;
        expect(Array.isArray(body.users)).to.equal(true);
        expect(body.users[0].lastName).to.equal(newLastName);
        done();
      });
  });

  it('should successfully update a user\'s email', (done) => {
    const validToken = getValidToken();
    request.put(`${updateUserProfileEndpoint}/${userId}`)
      .send({ username: newUsername })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw new Error(err);
        const body = res.body;
        expect(Array.isArray(body.users)).to.equal(true);
        expect(body.users[0].username).to.equal(newUsername);
        done();
      });
  });

  it('should successfully update a user\'s password', (done) => {
    const validToken = getValidToken();
    request.put(`${updateUserProfileEndpoint}/${userId}`)
      .send({ password: newPassword })
      .set('x-docs-cabinet-authentication', validToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw new Error(err);
        const body = res.body;
        expect(Array.isArray(body.users)).to.equal(true);
        expect(body.message).to.equal('Profile updated');
        done();
      });
  });
});
