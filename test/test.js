const pkg = require('../package.json');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

// Read API key from backend .env
const envPath = path.resolve(__dirname, '../../proxifly-backend/functions/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKey = envContent.match(/BACKEND_MANAGER_KEY="(.+?)"/)?.[1] || '';

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
describe(`${pkg.name}`, () => {
  const Proxifly = require('../dist/index.js').default;
  const proxifly = new Proxifly({
    apiKey: apiKey,
  });

  // Get Proxy
  describe('.getProxy()', () => {
    it('gets a proxy', () => {
      return proxifly.getProxy()
        .then((json) => {
          console.log('Response:', json);
          assert.equal(typeof json, 'object');
          assert.equal(typeof json.proxy, 'string');
        })
    });

    it('gets multiple proxies', () => {
      return proxifly.getProxy({ quantity: 5, protocol: 'socks4' })
        .then((json) => {
          console.log('Response:', json);
          assert.equal(Array.isArray(json), true);
        })
    });
  });

  // Get Public IP
  describe('.getPublicIp()', () => {
    it('displays your public IP', () => {
      return proxifly.getPublicIp()
        .then((json) => {
          console.log('Response:', json);
          assert.equal(typeof json, 'object');
          assert.equal(typeof json.ip, 'string');
        })
    });
  });
})
