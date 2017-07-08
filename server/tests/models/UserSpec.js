import chai from 'chai';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../../models/';

dotenv.config();
const expect = chai.expect;

describe('The User model', () => {
  const saltLength = Number.parseInt(process.env.PASSWORD_SALT_LENGTH, 10);
  const dummyUser = {
    firstName: 'Don',
    lastName: 'Quixote',
    username: 'dquixote@example.com',
    password: bcryptjs.hashSync('#1Twothree', saltLength),
    roleId: 0
  };

  const duplicateUser = Object.assign(dummyUser);

  const completeNewUser = {
    firstName: 'Huckleberry',
    lastName: 'Finn',
    username: 'dfinn@example.com',
    password: bcryptjs.hashSync('#Sub0weather', saltLength),
    roleId: 0
  };

  before('Create a sample user', (done) => {
    User
      .create(dummyUser)
      .then(() => {
        done();
      });
  });

  after('Remove the sample user used in this suite\'s specs', (done) => {
    User
      .destroy({
        where: {
          username: [dummyUser.username, completeNewUser.username]
        }
      })
      .then(() => {
        done();
      });
  });

  it('should reject the creation of duplicate accounts', (done) => {
    User.create(duplicateUser)
      .catch((errors) => {
        expect(errors.name).to.equal('SequelizeUniqueConstraintError');
        done();
      });
  });

  it('should reject the creation of accounts that do NOT have a username', (done) => {
    const noUsername = {
      firstName: 'Huckleberry',
      lastName: 'Finn',
      password: bcryptjs.hashSync('#Sub0weather', saltLength),
      roleId: 0
    };
    User.create(noUsername)
      .catch((errors) => {
        const expectedMessage = 'null value in column "username" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of accounts that do NOT have a first name', (done) => {
    const noFirstName = {
      lastName: 'Finn',
      username: 'dfinn@example.com',
      password: bcryptjs.hashSync('#Sub0weather', saltLength),
      roleId: 0
    };
    User.create(noFirstName)
      .catch((errors) => {
        const expectedMessage = 'null value in column "firstName" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of accounts that do NOT have a last name', (done) => {
    const noLastName = {
      firstName: 'Huckleberry',
      username: 'dfinn@example.com',
      password: bcryptjs.hashSync('#Sub0weather', saltLength),
      roleId: 0
    };
    User.create(noLastName)
      .catch((errors) => {
        const expectedMessage = 'null value in column "lastName" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of accounts that do NOT have a password', (done) => {
    const noPassword = {
      firstName: 'Huckleberry',
      lastName: 'Finn',
      username: 'dfinn@example.com',
      roleId: 0
    };
    User.create(noPassword)
      .catch((errors) => {
        const expectedMessage = 'null value in column "password" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the use of non-integer values for role id\'s', (done) => {
    const invalidRoleId = {
      firstName: 'Huckleberry',
      lastName: 'Finn',
      username: '09dfinn@example.com',
      password: bcryptjs.hashSync('#Sub0weather', saltLength),
      roleId: 'foo'
    };
    User.create(invalidRoleId)
      .catch((errors) => {
        const expectedMessage = 'invalid input syntax for integer: "foo"';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject role id\'s that are not defined in the Role model', (done) => {
    const nonExistentRoleId = {
      firstName: 'Huckleberry',
      lastName: 'Finn',
      username: 'dfinn@example.com',
      password: bcryptjs.hashSync('#Sub0weather', saltLength),
      roleId: 6543210
    };
    User.create(nonExistentRoleId)
      .catch((errors) => {
        const expectedMessage = 'insert or update on table "User" violates' +
        ' foreign key constraint "User_roleId_fkey"';
        expect(errors.name).to.equal('SequelizeForeignKeyConstraintError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should successfully create a new user', (done) => {
    User.create(completeNewUser)
      .then((user) => {
        expect(user.firstName).to.equal(completeNewUser.firstName);
        expect(user.lastName).to.equal(completeNewUser.lastName);
        expect(user.username).to.equal(completeNewUser.username);
        done();
      });
  });
});
