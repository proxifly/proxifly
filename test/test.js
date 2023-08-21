const package = require('../package.json');
const assert = require('assert');
const fetch = require('wonderful-fetch');

beforeEach(async () => {
});

before(async () => {
});

after(async () => {
});

/*
 * ============
 *  Test Cases
 * ============
 */
describe(`${package.name}`, () => {
  const proxifly = new (require('../dist/index.js'))({
    apiKey: 'api_test_key',
  })

  // Get Proxy
  describe('.getProxy()', () => {
    it('gets a proxy', () => {
      return proxifly.getProxy()
        .then((json) => {
          console.log('Response 1:', json);
          // Should be an object
          assert.equal(typeof json, 'object');
        })
        .catch(e => {
          console.error(e);
        })
    });

    it('gets multiple proxies', () => {
      return proxifly.getProxy({quantity: 5, protocol: 'socks4'})
        .then((json) => {
          console.log('Response 2:', json);
          // Should be an array
          assert.equal(Array.isArray(json), true);
        })
        .catch(e => {
          console.error(e);
        })
    });
  });

  // Get Public IP
  describe('.getPublicIp()', () => {
    it('displays your public IP', () => {
      return proxifly.getPublicIp()
        .then((json) => {
          console.log('Response 1:', json);
          // Should be an object
          assert.equal(typeof json.ip, 'string');
          assert.equal(typeof json.geolocation.country, 'string');
        })
        .catch(e => {
          console.error(e);
        })
    });
  });
})
