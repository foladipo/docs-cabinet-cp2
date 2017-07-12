/**
 * MockHttpClient - an object that mocks the methods of superagent. Used
 * to simulate successful/error-free API calls.
 */
const MockHttpClient = {
  get() { return this; },
  post() { return this; },
  put() { return this; },
  delete() { return this; },
  send() { return this; },
  set() { return this; },
  end(callback) {
    const res = {
      body: {
        message: 'Request successful.'
      }
    };
    callback(undefined, res);
  }
};

export default MockHttpClient;
