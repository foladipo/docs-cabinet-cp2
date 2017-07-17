const faker = require('faker');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5000;
const user = {
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
  username: faker.internet.email(),
  password: 'Jsd8jdJ9(^&'
};

const search = {
  query: 'a'
};


module.exports = {
  'Create an account': (browser) => {
    browser
      .url(`http://localhost:${port}`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#sign-up-form-btn', 2000)
      .click('#sign-up-form-btn')
      .waitForElementVisible('#sign-up-form', 5000)
      .setValue('#sign-up-form #update-first-name', user.firstName)
      .setValue('#sign-up-form #update-last-name', user.lastName)
      .setValue('#sign-up-form #update-username', user.username)
      .setValue('#sign-up-form #update-password', user.password)
      .click('#sign-up-btn')
      .waitForElementNotPresent('#authentication-container', 3000)
      .waitForElementPresent('#authenticated-user-area', 3000)
      .assert
        .urlEquals(`http://localhost:${port}/dashboard`);
  },
  'Search for a document': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard/searchDocuments`)
      .assert
        .elementNotPresent('#all-documents-page')
      .assert
        .elementPresent('#search-documents-page')
      .waitForElementVisible('#search-btn', 2000)
      .assert
        .cssClassPresent('#search-btn', 'disabled')
      .setValue('#search-documents-form .search-input', search.query)
      .pause(2000)
      .assert
        .cssClassNotPresent('#search-btn', 'disabled')
      .click('#search-btn')
      .pause(5000)
      .assert
        .elementPresent('.search-filter-categories')
      .setValue('.search-filter-categories', 's')
      .pause(2000)
      .assert
        .elementPresent('.search-filter-tags')
      .setValue('.search-filter-tags', 's')
      .pause(2000)
      .setValue('.search-filter-categories', '8929ki989okju8789ijy')
      .setValue('.search-filter-tags', 'sdfenjsndjnd')
      .pause(2000)
      .clearValue('.search-filter-categories')
      .clearValue('.search-filter-tags')
      .pause(5000);
  },
  'Search for a user': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard/searchUsers`)
      .assert
        .elementNotPresent('#all-documents-page')
      .assert
        .elementPresent('#search-users-page')
      .waitForElementVisible('#search-btn', 2000)
      .assert
        .cssClassPresent('#search-btn', 'disabled')
      .setValue('#search-users-form .search-input', search.query)
      .pause(5000)
      .assert
        .cssClassNotPresent('#search-btn', 'disabled')
      .click('#search-btn')
      .pause(5000);
  },
  'Delete account': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .click('#update-profile-btn')
      .waitForElementVisible('#update-user-page', 3000)
      .click('#delete-user-form-btn')
      .waitForElementVisible('#delete-user-form', 3000)
      .assert
        .cssClassPresent('#delete-user-btn', 'disabled')
      .setValue('#confirm-deletion-input', user.username)
      .click('#delete-user-btn')
      .waitForElementNotPresent('#authenticated-user-area', 3000)
      .assert
        .elementNotPresent('#authenticated-user-area')
      .assert
        .elementPresent('#authentication-container')
      .pause(5000)
      .end();
  }
};
