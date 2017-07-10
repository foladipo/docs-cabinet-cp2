import JSDom from 'jsdom';
const jsdom = JSDom.jsdom;

const exposedProperties = ['document', 'window', 'navigator'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((key) => {
  if (typeof global[key] === 'undefined') {
    exposedProperties.push(key);
    global[key] = document.defaultView[key];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
