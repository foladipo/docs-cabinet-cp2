import chai from 'chai';
import dotenv from 'dotenv';
import uuid from 'uuid';
import Document from '../../models/Document';

dotenv.config();
const expect = chai.expect;

describe('The Document model', () => {
  const dummyDocument = {
    title: `Spalaxicon${uuid.v4()}`,
    content: 'Lorem ipsum',
    access: 'public',
    categories: 'foo',
    tags: 'bar',
    authorId: 0
  };

  const completeNewDocument = {
    title: `Spalaxicon${uuid.v4()}`,
    content: 'Sit dolor amet plavoy',
    access: 'public',
    categories: 'quuz',
    tags: 'qlat',
    authorId: 0
  };

  before('Create a sample document', (done) => {
    Document
      .create(dummyDocument)
      .then(() => {
        done();
      });
  });

  after('Remove the sample document used in this suite\'s specs', (done) => {
    Document
      .destroy({
        where: {
          title: [dummyDocument.title, completeNewDocument.title]
        }
      })
      .then(() => {
        done();
      });
  });

  it('should reject the creation of documents that do NOT have a title', (done) => {
    const noTitle = {
      content: 'Lorem ipsum',
      access: 'public',
      categories: 'foo',
      tags: 'bar',
      authorId: 0
    };
    Document.create(noTitle)
      .catch((errors) => {
        const expectedMessage = 'null value in column "title" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of documents that do NOT have content', (done) => {
    const noContent = {
      title: 'Spalaxicon1',
      access: 'public',
      categories: 'foo',
      tags: 'bar',
      authorId: 0
    };
    Document.create(noContent)
      .catch((errors) => {
        const expectedMessage = 'null value in column "content" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of documents that do NOT have categories', (done) => {
    const noCategories = {
      title: 'Spalaxicon1',
      content: 'Lorem ipsum',
      access: 'public',
      tags: 'bar',
      authorId: 0
    };
    Document.create(noCategories)
      .catch((errors) => {
        const expectedMessage = 'null value in column "categories" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of documents that do NOT have tags', (done) => {
    const noTags = {
      title: 'Spalaxicon1',
      content: 'Lorem ipsum',
      access: 'public',
      categories: 'foo',
      authorId: 0
    };
    Document.create(noTags)
      .catch((errors) => {
        const expectedMessage = 'null value in column "tags" violates' +
        ' not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of documents that do NOT have an access type', (done) => {
    const noAccessTypes = {
      title: 'Spalaxicon1',
      content: 'Lorem ipsum',
      access: '',
      categories: 'foo',
      tags: 'bar',
      authorId: 0
    };
    Document.create(noAccessTypes)
      .catch((errors) => {
        const expectedMessage = 'Validation error: Validation is' +
        ' failed,\nValidation error: You must specify the access level' +
        ' of your document as either \'public\', \'private\' or \'role\'.';
        expect(errors.name).to.equal('SequelizeValidationError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject documents that do NOT have an access type of \'public\',' +
    ' \'private\' or \'role\'', (done) => {
    const invalidAccessType = {
      title: 'Spalaxicon1',
      content: 'Lorem ipsum',
      access: 'random',
      categories: 'foo',
      tags: 'bar',
      authorId: 0
    };
    Document.create(invalidAccessType)
      .catch((errors) => {
        const expectedMessage = 'Validation error: You must specify the' +
        ' access level of your document as either \'public\', \'private\' or' +
        ' \'role\'.';
        expect(errors.name).to.equal('SequelizeValidationError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of documents that do NOT have an' +
    ' authorId', (done) => {
    const noAuthorId = {
      title: 'Spalaxicon1',
      content: 'Lorem ipsum',
      access: 'public',
      categories: 'foo',
      tags: 'bar'
    };
    Document.create(noAuthorId)
      .catch((errors) => {
        const expectedMessage = 'null value in column "authorId" violates not-null constraint';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of documents whose authorId (i.e author id) is NOT an integer', (done) => {
    const invalidAuthorId = {
      title: 'Spalaxicon1',
      content: 'Lorem ipsum',
      access: 'public',
      categories: 'foo',
      tags: 'bar',
      authorId: 'quux'
    };
    Document.create(invalidAuthorId)
      .catch((errors) => {
        const expectedMessage = 'invalid input syntax for integer: "quux"';
        expect(errors.name).to.equal('SequelizeDatabaseError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should reject the creation of documents whose authorId (i.e author id) is NOT in the User model', (done) => {
    const nonExistentUser = {
      title: 'Spalaxicon1',
      content: 'Lorem ipsum',
      access: 'public',
      categories: 'foo',
      tags: 'bar',
      authorId: 6543210
    };
    Document.create(nonExistentUser)
      .catch((errors) => {
        const expectedMessage = 'insert or update on table "Document" violates' +
        ' foreign key constraint "Document_authorId_fkey"';
        expect(errors.name).to.equal('SequelizeForeignKeyConstraintError');
        expect(errors.message).to.equal(expectedMessage);
        done();
      });
  });

  it('should successfully create a new document', (done) => {
    Document.create(completeNewDocument)
      .then((document) => {
        expect(document.title).to.equal(completeNewDocument.title);
        expect(document.content).to.equal(completeNewDocument.content);
        done();
      });
  });
});
