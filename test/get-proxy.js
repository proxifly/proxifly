var Proxifly = require('../dist/index.js')

var proxifly = new Proxifly({
  apiKey: 'api_test_key' // Not required, but having one removes limits (get your key at https://proxifly.dev).
});

console.log('Sending...')
return proxifly.getProxy()
.then(proxy => {
  console.log('getProxy:', proxy);
})
.catch(e => {
  console.error(e);
})
