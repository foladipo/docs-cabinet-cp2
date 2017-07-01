import supertest from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv';
import User from '../../models/User';
import app from '../../app';

dotenv.config();
const expect = chai.expect;

const request = supertest(app);
const signUpEndpoint = '/api/users';

describe('When POST\'ed to, the /api/users endpoint', () => {
  const newFirstName = 'Enygma';
  const newLastName = 'Unbeknownst';
  const newUsername = 'random@example.com';
  const newPassword = '@FooBar007';

  before('Remove the sample user used in this suite\'s specs', (done) => {
    User
      .destroy({
        where: {
          username: newUsername
        }
      })
      .then(() => {
        done();
      });
  });

  after('Remove the sample user used in this suite\'s specs', (done) => {
    User
      .destroy({
        where: {
          username: newUsername
        }
      })
      .then(() => {
        done();
      });
  });

  const noFirstName = {
    lastName: newLastName,
    username: newUsername,
    password: newPassword
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
    lastName: newLastName,
    username: newUsername,
    password: newPassword
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
    lastName: newLastName,
    username: newUsername,
    password: newPassword
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
    firstName: newFirstName,
    username: newUsername,
    password: newPassword
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
    firstName: newFirstName,
    lastName: '',
    username: newUsername,
    password: newPassword
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
    firstName: newFirstName,
    lastName: '2',
    username: newUsername,
    password: newPassword
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
    firstName: newFirstName,
    lastName: newLastName,
    password: newPassword
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
    firstName: newFirstName,
    lastName: newLastName,
    username: '',
    password: newPassword
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
    firstName: newFirstName,
    lastName: newLastName,
    username: '@example',
    password: newPassword
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
    firstName: newFirstName,
    lastName: newLastName,
    username: newUsername,
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
    firstName: newFirstName,
    lastName: newLastName,
    username: newUsername,
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
    firstName: newFirstName,
    lastName: newLastName,
    username: newUsername,
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
    firstName: newFirstName,
    lastName: newLastName,
    username: newUsername,
    password: newPassword
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
        expect(res.body.user.id).to.not.equal(undefined);
        expect(res.body.user.firstName).to.equal(validNewUser.firstName);
        expect(res.body.user.lastName).to.equal(validNewUser.lastName);
        expect(res.body.user.username).to.equal(validNewUser.username);
        expect(res.body.user.roleId >= 0).to.equal(true);
        done();
      });
  });
});
