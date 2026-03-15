<p align="center">
  <a href="https://proxifly.dev">
    <img src="https://cdn.itwcreativeworks.com/assets/proxifly/images/logo/proxifly-brandmark-black-x.svg" width="100px">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/proxifly/proxifly.svg">
  <img src="https://img.shields.io/bundlephobia/min/proxifly.svg">
  <img src="https://img.shields.io/npm/dm/proxifly.svg">
  <img src="https://img.shields.io/node/v/proxifly.svg">
  <img src="https://img.shields.io/github/license/proxifly/proxifly.svg">
  <br>
  <br>
  <a href="https://proxifly.dev">Site</a> | <a href="https://www.npmjs.com/package/proxifly">NPM Module</a> | <a href="https://github.com/proxifly/proxifly">GitHub Repo</a>
  <br>
  <br>
  <strong>Proxifly</strong> is a free service to get SOCKS, HTTP, & HTTPS proxies as well as check your public IP. Works in both Node and browser environments.
</p>

## Quick Start

### NPM

```
npm install proxifly
```

```js
// ESM
import Proxifly from 'proxifly';

// CommonJS
const Proxifly = require('proxifly');

const proxifly = new Proxifly({
  apiKey: 'your-api-key', // Optional, but removes rate limits (get yours at https://proxifly.dev)
});
```

### Script Tag

```html
<script src="https://cdn.jsdelivr.net/npm/proxifly@latest/dist/proxifly.min.js"></script>
<script>
  var proxifly = new Proxifly({
    apiKey: 'your-api-key',
  });
</script>
```

### curl

```shell
# Get your public IP
curl https://api.proxifly.dev/ip

# Get a proxy
curl https://api.proxifly.dev/proxy

# With options
curl "https://api.proxifly.dev/proxy?protocol=http&quantity=3&format=text"
```

## API

### `getProxy(options)`

Get a filtered list of proxies.

```js
proxifly.getProxy({
  protocol: 'http',     // http | socks4 | socks5
  anonymity: 'elite',   // transparent | anonymous | elite
  country: 'US',        // ISO country code
  https: true,          // true | false
  quantity: 1,          // 1 - 20
  format: 'json',       // json | text
})
.then(proxy => console.log(proxy))
.catch(e => console.error(e));
```

**Options**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `protocol` | `string` | — | Filter by protocol: `http`, `socks4`, `socks5` |
| `anonymity` | `string` | — | Filter by anonymity: `transparent`, `anonymous`, `elite` |
| `country` | `string` | — | Filter by ISO country code (`US`, `GB`, `DE`, etc.) |
| `https` | `boolean` | — | Filter by HTTPS support |
| `quantity` | `number` | `1` | Number of proxies to return (1–20). Returns an array when > 1. |
| `format` | `string` | `json` | Response format: `json` or `text` |
| `timeout` | `number` | `60000` | Request timeout in milliseconds |

**Example response**

```json
{
  "proxy": "socks4://103.99.110.222:5678",
  "protocol": "socks4",
  "ip": "103.99.110.222",
  "port": 5678,
  "https": false,
  "anonymity": "transparent",
  "score": 1,
  "geolocation": { "country": "IN", "city": "Unknown" }
}
```

### `getPublicIp(options)`

Get your public IP address.

```js
proxifly.getPublicIp()
.then(response => {
  console.log('IP:', response.ip);
  console.log('Country:', response.country);
})
.catch(e => console.error(e));
```

**Options**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `string` | `json` | Response format: `json` or `text` |
| `timeout` | `number` | `60000` | Request timeout in milliseconds |

**Example response**

```json
{
  "ip": "104.173.192.180",
  "continent": "NA",
  "country": "US",
  "region": "California",
  "city": "Los Angeles",
  "latitude": 34.0544,
  "longitude": -118.2441
}
```

## Development

```bash
npm start        # Watch mode - rebuilds on file changes
npm run build    # One-time build (ESM, CJS, IIFE)
npm test         # Run tests
```

### Build Outputs

| File | Format | Use Case |
|------|--------|----------|
| `dist/index.mjs` | ESM | `import` in modern bundlers (webpack, Vite, etc.) |
| `dist/index.js` | CJS | `require()` in Node.js |
| `dist/proxifly.min.js` | IIFE (minified) | `<script>` tag / CDN |

## License

MIT
