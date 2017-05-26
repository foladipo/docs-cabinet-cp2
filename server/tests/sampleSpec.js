import chai from 'chai';
import supertest from 'supertest';
import app from '../app';

const expect = chai.expect;

describe('The /api root endpoint', () => {
  it('should send a JSON response', () => {
    supertest(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('should send the appropriate message in its body', () => {
    supertest(app)
      .get('/api')
      .end((err, res) => {
        expect(res.body.message).to.equal('Hello world!');
      });
  });
});
