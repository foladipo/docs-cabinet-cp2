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
