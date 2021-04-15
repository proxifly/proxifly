var Proxifly = require('../dist/index.js')

var proxifly = new Proxifly({
  apiKey: 'api_test_Key' // Not required, but having one removes limits (get your key at https://proxifly.com).
});

console.log('Sending...')
return proxifly.getProxy()
.then(proxy => {
  console.log('getProxy:', proxy);
})
.catch(e => {
  console.error(e);
})
