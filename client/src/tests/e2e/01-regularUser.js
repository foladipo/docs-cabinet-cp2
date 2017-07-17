const faker = require('faker');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5000;
const user = {
  firstName: 'Tailor',
  lastName: 'Who',
  username: 'tailor@example.com',
  password: 'Jsd8jdJ9(^&'
};

const userUpdate = {
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
  username: faker.internet.email(),
  password: 'Jsd8jdJ9(^&'
};


module.exports = {
  'Creating an account with incomplete biodata': (browser) => {
    browser
      .url(`http://localhost:${port}/`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#sign-up-form-btn', 2000)
      .click('#sign-up-form-btn')
      .waitForElementVisible('#sign-up-form', 5000)
      .setValue('#sign-up-form #update-first-name', '')
      .setValue('#sign-up-form #update-last-name', '')
      .setValue('#sign-up-form #update-username', 'xyz@example.com')
      .setValue('#sign-up-form #update-password', 'sk89dd()HUt')
      .click('#sign-up-btn')
      .waitForElementVisible('#sign-up-form .error-msg', 1000)
      .assert
        .containsText(
          '#sign-up-form .error-msg',
          'Please enter a first name with at least two non-whitespace characters.'
        );
  },
  'Creating an account': (browser) => {
    browser
      .url(`http://localhost:${port}/`)
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
      .assert
        .elementNotPresent('#authentication-container')
      .url(`http://localhost:${port}/dashboard`)
      .waitForElementPresent('#authenticated-user-area', 3000)
      .assert
        .elementPresent('#authenticated-user-area')
      .assert
        .elementNotPresent('#view-all-users-btn');
  },
  'Logging out': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .click('#logout-btn')
      .waitForElementNotPresent('#authenticated-user-area', 3000)
      .assert
        .elementNotPresent('#authenticated-user-area')
      .assert
        .elementPresent('#authentication-container');
  },
  'Logging in without credentials': (browser) => {
    browser
      .url(`http://localhost:${port}/`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#login-form-btn', 2000)
      .click('#login-form-btn')
      .waitForElementVisible('#login-modal', 5000)
      .setValue('#login-form #update-username', '')
      .setValue('#login-form #update-password', '')
      .click('#login-btn')
      .waitForElementVisible('#login-form .error-msg', 1000)
      .assert
        .containsText(
          '#login-form .error-msg',
          'Please enter your email and password to login.'
        );
  },
  'Logging in with non-existent account': (browser) => {
    browser
      .url(`http://localhost:${port}/`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#login-form-btn', 2000)
      .click('#login-form-btn')
      .waitForElementVisible('#login-modal', 5000)
      .setValue('#login-form #update-username', 'phantom@abc.com')
      .setValue('#login-form #update-password', 'jskdlwkwio32423')
      .click('#login-btn')
      .waitForElementVisible('#login-form .error-msg', 1000)
      .assert
        .containsText(
          '#login-form .error-msg',
          'Yikes! You don\'t have an account yet. Please sign up, or check your login details.'
        );
  },
  'Logging in': (browser) => {
    browser
      .url(`http://localhost:${port}/`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#login-form-btn', 2000)
      .click('#login-form-btn')
      .waitForElementVisible('#login-modal', 5000)
      .setValue('#login-form #update-username', user.username)
      .setValue('#login-form #update-password', user.password)
      .click('#login-btn')
      .waitForElementPresent('#authenticated-user-area', 3000)
      .assert
        .elementPresent('#authenticated-user-area');
  },
  'Update account': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .click('#update-profile-btn')
      .waitForElementPresent('#update-user-page', 3000)
      .assert
        .elementPresent('#update-user-page')
      .setValue('#update-first-name', userUpdate.firstName)
      .setValue('#update-last-name', userUpdate.lastName)
      .click('#attempt-profile-update-btn')
      .waitForElementVisible('.msg-container .success-msg', 9000)
      .assert
        .containsText('.msg-container .success-msg', 'Account updated.');
  },
  'Delete account': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard`)
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .click('#update-profile-btn')
      .waitForElementPresent('#update-user-page', 3000)
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
      .end();
  }
};
