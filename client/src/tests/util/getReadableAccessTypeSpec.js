import _ from 'lodash';
import chai from 'chai';
import getReadableAccessType from '../../util/getReadableAccessType';

const expect = chai.expect;

describe('getReadableAccessType', () => {
  it('should return the original access if it isn\'t a string or is an empty string', () => {
    const accessObject = { random: 'foo' };
    const roleId = 0;
    let accessType = getReadableAccessType(accessObject, roleId);
    expect(_.isEqual(accessObject, accessType)).to.equal(true);
    const accessEmptyString = '';
    accessType = getReadableAccessType(accessEmptyString, roleId);
    expect(accessType).to.equal('');
  });

  it('should return a special message for role-visible documents', () => {
    let access = 'role';
    let roleId = 0;
    let accessType = getReadableAccessType(access, roleId);
    expect(accessType).to.equal('Visible to other regular users.');

    access = 'role';
    roleId = 1;
    accessType = getReadableAccessType(access, roleId);
    expect(accessType).to.equal('Visible to other admins.');
  });

  it('should a special message for public documents', () => {
    const access = 'public';
    const roleId = 0;
    const accessType = getReadableAccessType(access, roleId);
    expect(accessType).to.equal('Public document.');
  });

  it('should a special message for private documents', () => {
    const access = 'private';
    const roleId = 0;
    const accessType = getReadableAccessType(access, roleId);
    expect(accessType).to.equal('Private document.');
  });
});
