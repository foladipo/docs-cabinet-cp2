/**
 * MockHttpErrorClient - an object that mocks the methods of superagent. Used
 * to simulate failed/erroneous API calls.
 */
const MockHttpErrorClient = {
  get() { return this; },
  post() { return this; },
  put() { return this; },
  delete() { return this; },
  send() { return this; },
  set() { return this; },
  end(callback) {
    const error = {
      response: {
        body: {
          message: 'Request failed.'
        }
      }
    };
    callback(error);
  }
};

export default MockHttpErrorClient;
