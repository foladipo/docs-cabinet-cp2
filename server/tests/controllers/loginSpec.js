import supertest from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../../app';

dotenv.config();
const expect = chai.expect;

const request = supertest(app);
const loginEndpoint = '/api/users/login';

describe('When POST\'ed to, the /api/users/login endpoint', () => {
  const noUsernameNoPassword = {
    username: '',
    password: ''
  };
  it('should return an error for requests where the username and password are missing', (done) => {
    request.post(loginEndpoint)
      .send(noUsernameNoPassword)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter your email and password to login.',
        error: 'MissingLoginDetailsError'
      }, done);
  });

  const noUsername = {
    username: '',
    password: 'something'
  };
  it('should return an error for requests where the username is missing', (done) => {
    request.post(loginEndpoint)
      .send(noUsername)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Sorry, you need to enter your email.',
        error: 'MissingUsernameError'
      }, done);
  });

  const noPassword = {
    username: 'foo@example.com',
    password: ''
  };
  it('should return an error for requests where the password is missing', (done) => {
    request.post(loginEndpoint)
      .send(noPassword)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Sorry, you need to enter your password.',
        error: 'MissingPasswordError'
      }, done);
  });

  const invalidUsername = {
    username: 'foo@example',
    password: 'something'
  };
  it('should validate the username as a valid email address', (done) => {
    request.post(loginEndpoint)
      .send(invalidUsername)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Please enter a valid email.',
        error: 'InvalidUsernameError'
      }, done);
  });

  const nonExistentUser = {
    username: 'nonexistent@user.com',
    password: 'something'
  };
  it('should return an error for login attempts for a non-existent user', (done) => {
    request.post(loginEndpoint)
      .send(nonExistentUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Yikes! You don\'t have an account yet. Please sign up, or check your login details.',
        error: 'NonExistentUserError'
      }, done);
  });

  const incorrectPassword = {
    username: 'foo@example.com',
    password: 'incorrectPassword'
  };
  it('should return an error for login attempts with an incorrect password', (done) => {
    request.post(loginEndpoint)
      .send(incorrectPassword)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        message: 'Nope. That\'s not the correct password.',
        error: 'IncorrectPasswordError'
      }, done);
  });

  const validLoginDetails = {
    username: 'foo@example.com',
    password: '1Very&&Hard$@'
  };
  const user = {
    id: 0,
    username: 'foo@example.com',
    roleId: 0,
    firstName: 'Lagbaja',
    lastName: 'Anonymous'
  };
  it('should return a JWT token and a user\'s profile when the login details' +
    ' are correct', (done) => {
    request.post(loginEndpoint)
      .send(validLoginDetails)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.token).to.not.equal(undefined);
        expect(res.body.user).to.deep.equal(user);
        done();
      });
  });
});
