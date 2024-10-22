import chai from 'chai';
import dotenv from 'dotenv';
import { Role } from '../../models/';

dotenv.config();
const expect = chai.expect;

describe('The Role model', () => {
  const dummyRole = {
    id: 5,
    roleName: 'Spalaxicon#01'
  };

  const duplicateRole = Object.assign(dummyRole);

  const completeNewRole = {
    id: 6,
    roleName: 'Spalaxicon#02'
  };

  before('Create a sample role', (done) => {
    Role
      .create(dummyRole)
      .then(() => {
        done();
      });
  });

  after('Remove the sample role(s) used in this suite\'s specs', (done) => {
    Role
      .destroy({
        where: {
          roleName: [dummyRole.roleName, completeNewRole.roleName]
        }
      })
      .then(() => {
        done();
      });
  });

  it('should return an error for the creation of duplicate roles', (done) => {
    Role.create(duplicateRole)
      .catch((errors) => {
        expect(errors.name).to.equal('SequelizeUniqueConstraintError');
        done();
      });
  });

  it('should return an error for the creation of roles that don\'t have a name', (done) => {
    const noRoleName = {};
    Role.create(noRoleName)
      .catch((errors) => {
        const expectedMessage = 'null value in column "roleName" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should return an error for new roles with the same role name as the "admin" role', (done) => {
    const adminRoleName = { roleName: 'admin' };
    Role.create(adminRoleName)
      .catch((errors) => {
        const expectedMessage = 'Validation error';
        expect(errors.name).to.equal('SequelizeUniqueConstraintError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should return an error for new roles with the same role name as the "regular" role', (done) => {
    const regularRoleName = { roleName: 'regular' };
    Role.create(regularRoleName)
      .catch((errors) => {
        const expectedMessage = 'Validation error';
        expect(errors.name).to.equal('SequelizeUniqueConstraintError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should successfully create a new role', (done) => {
    Role.create(completeNewRole)
      .then((role) => {
        expect(role.roleName).to.equal(completeNewRole.roleName);
        done();
      });
  });
});
