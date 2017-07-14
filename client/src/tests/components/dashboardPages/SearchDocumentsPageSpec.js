import React from 'react';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';
import SearchDocumentsPage from '../../../components/dashboardPages/SearchDocumentsPage';

chai.use(chaiEnzyme());
const expect = chai.expect;

const spy = sinon.spy();
const props = {
  dispatch: () => {},
  user: {
    token: 'RANDOM_TOKEN',
    user: {
      id: 4
    }
  },
  User: {
    id: 7,
    firstName: 'Gbenga',
    lastName: 'Adeyemi'
  },
  search: {
    documents: {
      lastSearchQuery: '',
      lastSearchResultsCount: 0,
      lastSearchResults: []
    }
  }
};

const wrapper = mount(<SearchDocumentsPage {...props} />);

describe('SearchDocumentsPage', () => {
  it('should have an HTML class of search-documents-page', () => {
    expect(wrapper).to.have.className('search-documents-page');
  });

  it('should have a search form', () => {
    expect(wrapper.find('.search-form')).to.have.length(1);
  });

  it('should have a search button that\'s disabled by default', () => {
    expect(wrapper.find('button.col.s10.disabled')).to.have.length(1);
  });

  it('should be able to receive search queries from users', () => {
    const updateSearchQuerySpy = sinon.spy(wrapper.instance(), 'updateSearchQuery');
    wrapper.update();
    const searchQueryInput = wrapper.find('.search-input');
    const mockEvent = {
      preventDefault: () => {
      },
      target: { value: 'books' }
    };
    searchQueryInput.simulate('change', mockEvent);
    expect(updateSearchQuerySpy.calledOnce).to.equal(true);
  });

  it('should have an enabled search button when a query has been entered', () => {
    expect(wrapper.find('button.col.s10.disabled')).to.have.length(0);
  });

  it('should be able to perform searches', () => {
    wrapper.setState({ searchQuery: 'novels' });
    const attemptDocumentsSearchSpy =
      sinon.spy(wrapper.instance(), 'attemptDocumentsSearch');
    wrapper.update();
    const searchBtn = wrapper.find('.search-btn');
    searchBtn.simulate('click');
    expect(attemptDocumentsSearchSpy.calledOnce).to.equal(true);
  });

  it('should be able to filter searches by categories', () => {
    const filterByCategoriesSpy = sinon.spy(wrapper.instance(), 'updateCategoriesFilter');
    wrapper.update();
    const filterInput = wrapper.find('.search-filter-categories');
    const mockEvent = {
      preventDefault: () => {
      },
      target: { value: 'novels' }
    };
    filterInput.simulate('change', mockEvent);
    expect(filterByCategoriesSpy.calledOnce).to.equal(true);
  });

  it('should be able to filter searches by tags', () => {
    const filterByTagsSpy = sinon.spy(wrapper.instance(), 'updateTagsFilter');
    wrapper.update();
    const filterInput = wrapper.find('.search-filter-tags');
    const mockEvent = {
      preventDefault: () => {
      },
      target: { value: 'comics' }
    };
    filterInput.simulate('change', mockEvent);
    expect(filterByTagsSpy.calledOnce).to.equal(true);
  });
});
