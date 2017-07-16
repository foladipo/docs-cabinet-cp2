/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
// const config = require('../../../nightwatch.conf.js');

module.exports = {
  'User sign in without credentials': (browser) => {
    browser
      .url('http://localhost:5000/')
      .waitForElementVisible('body', 5000)
      .waitForElementVisible('#login-btn', 2000)
      .click('#login-btn')
      .waitForElementVisible('#loginModal', 5000)
      .setValue('input[name=email]', '')
      .setValue('input[name=password]', '')
      .click('.login-btn')
      .waitForElementVisible('.error-msg', 1000)
      .assert
        .containsText('.error-msg', 'Please enter your email and password to login.');
  }
};
