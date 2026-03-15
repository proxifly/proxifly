const pkg = require('../package.json');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

// Read API key from backend .env
const envPath = path.resolve(__dirname, '../../proxifly-backend/functions/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKey = envContent.match(/BACKEND_MANAGER_KEY="(.+?)"/)?.[1] || '';

describe(`${pkg.name} v${pkg.version}`, () => {
  const Proxifly = require('../dist/index.js').default;

  // ── Constructor ──────────────────────────────────────────────────────
  describe('constructor', () => {
    it('should create an instance with no options', () => {
      const proxifly = new Proxifly();
      assert.ok(proxifly);
      assert.strictEqual(proxifly.options.apiKey, '');
      assert.strictEqual(proxifly.options.debug, false);
    });

    it('should apply default options', () => {
      const proxifly = new Proxifly();
      assert.strictEqual(proxifly.options.apiKey, '');
      assert.strictEqual(proxifly.options.debug, false);
      assert.strictEqual(typeof proxifly.options.url, 'string');
      assert.ok(proxifly.options.url.startsWith('https://'));
    });

    it('should override options', () => {
      const proxifly = new Proxifly({
        apiKey: 'test-key',
        debug: true,
      });
      assert.strictEqual(proxifly.options.apiKey, 'test-key');
      assert.strictEqual(proxifly.options.debug, true);
    });

    it('should allow custom url', () => {
      const proxifly = new Proxifly({
        url: 'https://custom-api.example.com',
      });
      assert.strictEqual(proxifly.options.url, 'https://custom-api.example.com');
    });

    it('should keep defaults for options not overridden', () => {
      const proxifly = new Proxifly({ apiKey: 'test-key' });
      assert.strictEqual(proxifly.options.debug, false);
      assert.ok(proxifly.options.url.includes('proxifly'));
    });
  });

  // ── Static properties ────────────────────────────────────────────────
  describe('static', () => {
    it('should have version matching package.json', () => {
      assert.strictEqual(typeof Proxifly.version, 'string');
      assert.strictEqual(Proxifly.version, pkg.version);
    });
  });

  // ── Method existence ─────────────────────────────────────────────────
  describe('methods', () => {
    const proxifly = new Proxifly();

    it('should have getProxy method', () => {
      assert.strictEqual(typeof proxifly.getProxy, 'function');
    });

    it('should have getPublicIp method', () => {
      assert.strictEqual(typeof proxifly.getPublicIp, 'function');
    });
  });

  // ── API integration ──────────────────────────────────────────────────
  describe('API integration', () => {
    const proxifly = new Proxifly({
      apiKey: apiKey,
    });

    describe('.getProxy()', () => {
      it('should get a proxy', () => {
        return proxifly.getProxy()
          .then((json) => {
            console.log('Response:', json);
            assert.equal(typeof json, 'object');
            assert.equal(typeof json.proxy, 'string');
          })
      });

      it('should get multiple proxies', () => {
        return proxifly.getProxy({ quantity: 5, protocol: 'socks4' })
          .then((json) => {
            console.log('Response:', json);
            assert.equal(Array.isArray(json), true);
          })
      });
    });

    describe('.getPublicIp()', () => {
      it('should return public IP', () => {
        return proxifly.getPublicIp()
          .then((json) => {
            console.log('Response:', json);
            assert.equal(typeof json, 'object');
            assert.equal(typeof json.ip, 'string');
          })
      });
    });
  });

  // ── Error handling ───────────────────────────────────────────────────
  describe('error handling', () => {
    it('should reject with error for invalid url', () => {
      const proxifly = new Proxifly({
        url: 'https://invalid.proxifly.doesnotexist',
      });
      return proxifly.getPublicIp({ timeout: 5000 })
        .then(() => {
          assert.fail('Should have thrown');
        })
        .catch((err) => {
          assert.ok(err);
        });
    });
  });

  // ── Multiple instances ───────────────────────────────────────────────
  describe('multiple instances', () => {
    it('should maintain independent options', () => {
      const a = new Proxifly({ apiKey: 'key-a', debug: true });
      const b = new Proxifly({ apiKey: 'key-b' });

      assert.strictEqual(a.options.apiKey, 'key-a');
      assert.strictEqual(b.options.apiKey, 'key-b');
      assert.strictEqual(a.options.debug, true);
      assert.strictEqual(b.options.debug, false);
    });
  });
});
