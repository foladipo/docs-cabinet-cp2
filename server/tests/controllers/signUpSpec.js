import supertest from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import app from '../../app';

dotenv.config();
const expect = chai.expect;

const request = supertest(app);
const signUpEndpoint = '/api/users';

// TODO: Add before() and after() blocks that will use the DELETE HTTP verb
// on the /api/users/<id> endpoint to remove the user below from this
// application's DB before and after the tests are run, respectively.
// For now, we'll do that manually.
describe('When POST\'ed to, the /api/users endpoint', () => {
  const noFirstName = {
    lastName: 'Unbeknownst',
    username: 'random@example.com',
    password: '@FooBar007'
  };
  it('should reject requests where the first name is missing', (done) => {
    request.post(signUpEndpoint)
      .send(noFirstName)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'MissingFirstNameError'
      }, done);
  });

  const emptyFirstName = {
    firstName: '',
    lastName: 'Unbeknownst',
    username: 'random@example.com',
    password: '@FooBar007'
  };
  it('should reject requests where the first name is empty', (done) => {
    request.post(signUpEndpoint)
      .send(emptyFirstName)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'EmptyFirstNameError'
      }, done);
  });

  const invalidFirstName = {
    firstName: '2',
    lastName: 'Unbeknownst',
    username: 'random@example.com',
    password: '@FooBar007'
  };
  it('should reject requests where the first name is invalid', (done) => {
    request.post(signUpEndpoint)
      .send(invalidFirstName)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'InvalidFirstNameError'
      }, done);
  });

  const noLastName = {
    firstName: 'Enygma',
    username: 'random@example.com',
    password: '@FooBar007'
  };
  it('should reject requests where the last name is missing', (done) => {
    request.post(signUpEndpoint)
      .send(noLastName)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'MissingLastNameError'
      }, done);
  });

  const emptyLastName = {
    firstName: 'Enygma',
    lastName: '',
    username: 'random@example.com',
    password: '@FooBar007'
  };
  it('should reject requests where the last name is empty', (done) => {
    request.post(signUpEndpoint)
      .send(emptyLastName)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'EmptyLastNameError'
      }, done);
  });

  const invalidLastName = {
    firstName: 'Enygma',
    lastName: '2',
    username: 'random@example.com',
    password: '@FooBar007'
  };
  it('should reject requests where the last name is invalid', (done) => {
    request.post(signUpEndpoint)
      .send(invalidLastName)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'InvalidLastNameError'
      }, done);
  });

  const noUsername = {
    firstName: 'Enygma',
    lastName: 'Unbeknownst',
    password: '@FooBar007'
  };
  it('should reject requests where the username is missing', (done) => {
    request.post(signUpEndpoint)
      .send(noUsername)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'MissingUsernameError'
      }, done);
  });

  const emptyUsername = {
    firstName: 'Enygma',
    lastName: 'Unbeknownst',
    username: '',
    password: '@FooBar007'
  };
  it('should reject requests where the username is empty', (done) => {
    request.post(signUpEndpoint)
      .send(emptyUsername)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'EmptyUsernameError'
      }, done);
  });

  const invalidUsername = {
    firstName: 'Enygma',
    lastName: 'Unbeknownst',
    username: '@example',
    password: '@FooBar007'
  };
  it('should reject requests where the username is NOT a valid email' +
    ' address', (done) => {
    request.post(signUpEndpoint)
      .send(invalidUsername)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'InvalidUsernameError'
      }, done);
  });

  const existingUser = {
    firstName: 'Lagbaja',
    lastName: 'Anonymous',
    username: 'foo@example.com',
    password: '1Very&&Hard$@3'
  };
  it('should reject the use of one username for multiple accounts', (done) => {
    request.post(signUpEndpoint)
      .send(existingUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'UserExistsError'
      }, done);
  });

  const noPassword = {
    firstName: 'Enygma',
    lastName: 'Unbeknownst',
    username: 'foo@example.com',
  };
  it('should reject requests where the password is missing', (done) => {
    request.post(signUpEndpoint)
      .send(noPassword)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'MissingPasswordError'
      }, done);
  });

  const emptyPassword = {
    firstName: 'Enygma',
    lastName: 'Unbeknownst',
    username: 'foo@example.com',
    password: ''
  };
  it('should reject requests where the password is empty', (done) => {
    request.post(signUpEndpoint)
      .send(emptyPassword)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'EmptyPasswordError'
      }, done);
  });

  const invalidPassword = {
    firstName: 'Enygma',
    lastName: 'Unbeknownst',
    username: 'foo@example.com',
    password: '2'
  };
  it('should prevent the use of a weak password', (done) => {
    request.post(signUpEndpoint)
      .send(invalidPassword)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect({
        error: 'InvalidPasswordError'
      }, done);
  });

  const validNewUser = {
    firstName: 'Enygma',
    lastName: 'Unbeknownst',
    username: 'random@example.com',
    password: '@FooBar007'
  };
  it('should return a JWT token and a user\'s profile when supplied with' +
    ' complete and valid data', (done) => {
    request.post(signUpEndpoint)
      .send(validNewUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.token).to.not.equal(undefined);
        expect(res.body.user.userId).to.not.equal(undefined);
        expect(res.body.user.firstName).to.equal(validNewUser.firstName);
        expect(res.body.user.lastName).to.equal(validNewUser.lastName);
        expect(res.body.user.username).to.equal(validNewUser.username);
        expect(res.body.user.roleId >= 0).to.equal(true);
        done();
      });
  });
});
