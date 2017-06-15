import chai from 'chai';
import dotenv from 'dotenv';
import uuid from 'uuid';
import Role from '../../models/Role';

dotenv.config();
const expect = chai.expect;

describe('The Role model', () => {
  const dummyRole = {
    roleName: `Spalaxicon${uuid.v4()}`
  };

  const duplicateRole = Object.assign(dummyRole);

  const completeNewRole = {
    roleName: `Spalaxicon${uuid.v4()}`
  };

  before('Create a sample role', (done) => {
    Role
      .findOrCreate({ where: { roleName: dummyRole.roleName }, defaults: dummyRole })
      .spread(() => {
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

  it('should reject the creation of duplicate roles', (done) => {
    Role.create(duplicateRole)
      .catch((errors) => {
        expect(errors.name).to.equal('SequelizeUniqueConstraintError');
        done();
      });
  });

  it('should reject the creation of roles that don\'t have a name', (done) => {
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

  it('should reject new roles with the same role name as the "admin" role', (done) => {
    const adminRoleName = { roleName: 'admin' };
    Role.create(adminRoleName)
      .catch((errors) => {
        const expectedMessage = 'Validation error';
        expect(errors.name).to.equal('SequelizeUniqueConstraintError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject new roles with the same role name as the "regular" role', (done) => {
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
