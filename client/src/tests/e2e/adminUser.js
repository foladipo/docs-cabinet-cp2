const dotenv = require('dotenv');

dotenv.config();

const adminUser = {
  firstName: process.env.SECONDARY_ADMIN_USER_FIRSTNAME,
  lastName: process.env.SECONDARY_ADMIN_USER_LASTNAME,
  username: process.env.SECONDARY_ADMIN_USER_USERNAME,
  password: process.env.SECONDARY_ADMIN_USER_PASSWORD
};


module.exports = {
  'An admin user sees a different menu': (browser) => {
    browser
      .maximizeWindow()
      .resizeWindow(1200, 800)
      .url('http://localhost:5000/')
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#login-form-btn', 2000)
      .click('#login-form-btn')
      .waitForElementVisible('#login-modal', 5000)
      .setValue('#login-form #update-username', adminUser.username)
      .setValue('#login-form #update-password', adminUser.password)
      .click('#login-btn')
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .waitForElementVisible('#view-all-users-btn', 2000)
      .assert
        .elementPresent('#view-all-users-btn')
      .click('#view-all-users-btn')
      .waitForElementPresent('#all-users-page', 2000)
      .assert
        .urlContains('/dashboard/users')
      .pause(5000);
  },
  'An admin cannot delete his/her own account': (browser) => {
    browser
      .url('http://localhost:5000/dashboard')
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .click('#update-profile-btn')
      .waitForElementPresent('#update-user-page', 3000)
      .assert
        .elementPresent('#update-user-form')
      .assert
        .elementNotPresent('#delete-account-section')
      .pause(5000);
  },
  'An admin user can update and/or delete other accounts': (browser) => {
    browser
      .url('http://localhost:5000/dashboard')
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .waitForElementVisible('#view-all-users-btn', 2000)
      .click('#view-all-users-btn')
      .waitForElementPresent('#all-users-page', 2000)
      .assert
        .urlContains('/dashboard/users')
      .click('.edit-user-btn')
      .waitForElementPresent('#update-user-page', 3000)
      .assert
        .elementPresent('#update-user-form')
      .assert
        .elementPresent('#delete-account-section')
      .pause(5000)
      .end();
  }
};
