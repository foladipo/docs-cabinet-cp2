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

global.window.localStorage = {
  clear: () => {},
  getItem: () => {},
  setItem: () => {}
};

global.$ = () => ({
  material_select: () => {},
  modal: () => {},
  on: () => {},
  sideNav: () => {},
  val: () => {}
});

global.Materialize = {
  toast: () => {}
};

global.CKEDITOR = {
  replace: () => {},
  instances: {
    create_doc_content_editor: {
      on: () => {},
      getData: () => 'Content',
      setData: () => {}
    },
    update_content_editor: {
      on: () => {},
      getData: () => 'Content',
      setData: () => {}
    }
  }
};
