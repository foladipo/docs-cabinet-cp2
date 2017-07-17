import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import SearchUsersPage from '../../../components/dashboardPages/SearchUsersPage';

chai.use(chaiEnzyme());
const expect = chai.expect;

const dispatchSpy = sinon.spy();
const props = {
  dispatch: dispatchSpy,
  user: {
    token: 'RANDOM_TOKEN',
    user: {
      id: 4
    }
  },
  search: {
    users: {
      lastSearchQuery: '',
      lastSearchResultsCount: 0,
      lastSearchResults: []
    }
  }
};

const wrapper = mount(<SearchUsersPage {...props} />);

describe('SearchUsersPage', () => {
  it('should have an HTML id of search-users-page', () => {
    expect(wrapper).to.have.id('search-users-page');
  });

  it('should have a search form', () => {
    expect(wrapper.find('#search-users-form')).to.have.length(1);
  });

  it('should have a search button that\'s disabled by default', () => {
    expect(wrapper.find('#search-btn.disabled')).to.have.length(1);
  });

  it('should be able to receive search queries from users', () => {
    const updateSearchQuerySpy = sinon.spy(wrapper.instance(), 'updateSearchQuery');
    wrapper.update();
    const searchQueryInput = wrapper.find('.search-input');
    const mockEvent = {
      preventDefault: () => {},
      target: { value: 'books' }
    };
    searchQueryInput.simulate('change', mockEvent);
    expect(updateSearchQuerySpy.calledOnce).to.equal(true);
  });

  it('should have an enabled search button when a query has been entered', () => {
    expect(wrapper.find('#search-btn.disabled')).to.have.length(0);
  });

  it('should be able to perform searches', () => {
    wrapper.setState({ searchQuery: 'Tamedu' });
    const attemptUsersSearchSpy =
      sinon.spy(wrapper.instance(), 'attemptUsersSearch');
    wrapper.update();
    const searchBtn = wrapper.find('#search-btn');
    searchBtn.simulate('click');
    expect(attemptUsersSearchSpy.calledOnce).to.equal(true);
    expect(dispatchSpy.calledOnce).to.equal(true);
  });

  it('should show an error message for searches without queries', () => {
    const newWrapper = mount(<SearchUsersPage {...props} />);
    newWrapper.setState({ searchQuery: '' });
    const attemptUsersSearchSpy =
      sinon.spy(newWrapper.instance(), 'attemptUsersSearch');
    newWrapper.update();
    const searchBtn = newWrapper.find('#search-btn');
    searchBtn.simulate('click');
    expect(attemptUsersSearchSpy.calledOnce).to.equal(true);
  });
});
