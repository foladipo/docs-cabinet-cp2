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

const document = {
  access: 'private',
  title: faker.lorem.words(),
  content: faker.lorem.lines(),
  categories: faker.lorem.words(),
  tags: faker.lorem.words()
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
      .waitForElementPresent('#main-container', 3000)
      .assert
        .urlEquals(`http://localhost:${port}/dashboard`);
  },
  'Create a document': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard`)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .click('#compose-document-btn')
      .waitForElementVisible('#create-document-form', 2000)
      .assert
        .cssClassPresent('#create-document-btn', 'disabled')
      .setValue('#create-document-form #new-document-access', document.access)
      .setValue('#create-document-form #new-document-title', document.title)
      .execute('CKEDITOR.instances.create_doc_content_editor.setData("Random text")')
      .setValue('#create-document-form #new-document-categories', document.categories)
      .setValue('#create-document-form #new-document-tags', document.tags)
      .pause(5000)
      .assert
        .cssClassNotPresent('#create-document-btn', 'disabled')
      .click('#create-document-btn')
      .waitForElementNotVisible('#create-document-form', 2000);
  },
  'Update a document': (browser) => {
    browser
      .url(`http://localhost:${port}/dashboard`)
      .waitForElementVisible('#dashboard-menu-btn', 2000)
      .click('#dashboard-menu-btn')
      .waitForElementVisible('#dashboard-menu', 2000)
      .click('#my-documents-btn')
      .waitForElementNotPresent('#all-documents-page', 4000)
      .waitForElementPresent('#user-documents-page', 4000)
      .assert
        .urlEquals(`http://localhost:${port}/dashboard/myDocuments`)
      .click('.edit-document-btn')
      .waitForElementNotPresent('#user-documents-page', 2000)
      .waitForElementPresent('#update-document-page', 2000)
      .assert
        .urlContains('/dashboard/updateDocument')
      .assert
        .cssClassPresent('#update-document-btn', 'disabled')
      .setValue('#update-document-form #update-access', 'public')
      .setValue('#update-document-form #update-title', faker.lorem.words())
      .execute('CKEDITOR.instances.update_content_editor.setData("Stuffs")')
      .setValue('#update-document-form #update-categories', faker.lorem.words())
      .setValue('#update-document-form #update-tags', faker.lorem.words())
      // TODO: Why isn't Selenium ACTUALLY clicking this button?
      // .click('#update-document-btn')
      // .waitForElementVisible('.msg-container .success-msg', 5000)
      // .assert
      //   .containsText('.msg-container .success-msg', 'Document updated.')
      .pause(5000);
  },
  'Delete a document': (browser) => {
    browser
      .url('http://localhost:5000/dashboard/myDocuments')
      .waitForElementPresent('#user-documents-page', 2000)
      .click('.delete-document-btn')
      .waitForElementVisible('#confirm-document-deletion', 2000)
      .pause(2000)
      .click('.cancel-deletion-btn')
      .waitForElementNotVisible('#confirm-document-deletion', 2000)
      .click('.delete-document-btn')
      .waitForElementVisible('#confirm-document-deletion', 2000)
      .pause(2000)
      .click('.confirm-deletion-btn')
      .waitForElementNotPresent('#confirm-document-deletion', 4000)
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
      .waitForElementNotPresent('#main-container', 3000)
      .assert
        .elementNotPresent('#main-container')
      .assert
        .elementPresent('#authentication-container')
      .pause(5000)
      .end();
  }
};
