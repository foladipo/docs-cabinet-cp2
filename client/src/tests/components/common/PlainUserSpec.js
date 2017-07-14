import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import PlainUser from '../../../components/common/PlainUser';

chai.use(chaiEnzyme());
const expect = chai.expect;

const props = {
  firstName: 'King',
  lastName: 'Kong',
  roleId: 0,
  username: 'kingkong@example.com'
};

const wrapper = mount(<PlainUser {...props} />);

describe('PlainUser', () => {
  it('should have an HTML class of plain-user', () => {
    expect(wrapper).to.have.className('plain-user');
  });

  it('should contain a small, card-like section', () => {
    expect(wrapper.find('div.small.card')).to.have.length(1);
  });

  it('should show a user\'s email and account type', () => {
    expect(wrapper.find('.chip')).to.have.length(2);
  });

  it('should show a user\'s fullname', () => {
    expect(wrapper.find('.user-full-name')).to.have.length(1);
  });
});
