import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import User from '../../../components/common/User';

chai.use(chaiEnzyme());
const expect = chai.expect;

const props = {
  id: 6,
  firstName: 'Mount',
  lastName: 'Zuma',
  roleId: 0,
  username: 'mountzuma@example.com'
};

const wrapper = shallow(<User {...props} />);

describe('User', () => {
  it('should have an HTML class of single-user', () => {
    expect(wrapper).to.have.className('single-user');
  });

  it('should be a medium-sized, card-like section', () => {
    expect(wrapper.find('div.medium.card')).to.have.length(1);
  });

  it('should show a profile image', () => {
    expect(wrapper.find('img')).to.have.length(1);
  });

  it('should show a user\'s fullname', () => {
    expect(wrapper.find('.user-full-name')).to.have.length(1);
  });

  it('should show a user\'s email and account type', () => {
    expect(wrapper.find('.chip')).to.have.length(2);
  });

  it('should have a button for editing the user\'s account', () => {
    expect(wrapper.find('[icon="mode_edit"]')).to.have.length(1);
  });
});
