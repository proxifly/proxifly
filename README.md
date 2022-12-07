<p align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/proxifly/images/logo/proxifly-brandmark-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/proxifly/images/logo/proxifly-brandmark-black-x.svg" width="100px">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/proxifly/proxifly.svg">
  <br>
  <img src="https://img.shields.io/librariesio/release/npm/proxifly.svg">
  <img src="https://img.shields.io/bundlephobia/min/proxifly.svg">
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/proxifly/proxifly.svg">
  <img src="https://img.shields.io/npm/dm/proxifly.svg">
  <img src="https://img.shields.io/node/v/proxifly.svg">
  <img src="https://img.shields.io/website/https/proxifly.dev.svg">
  <img src="https://img.shields.io/github/license/proxifly/proxifly.svg">
  <img src="https://img.shields.io/github/contributors/proxifly/proxifly.svg">
  <img src="https://img.shields.io/github/last-commit/proxifly/proxifly.svg">
  <br>
  <br>
  <a href="https://proxifly.dev">Site</a> | <a href="https://www.npmjs.com/package/proxifly">NPM Module</a> | <a href="https://github.com/proxifly/proxifly">GitHub Repo</a>
  <br>
  <br>
  <strong>proxifly</strong> is the official npm module of <a href="https://proxifly.dev">Proxifly</a>, a free service to get SOCKS, HTTP, & HTTPS proxies as well as to check your public IP!
</p>

## Proxifly Works in Node AND browser environments
Yes, this module works in both Node and browser environments, including compatibility with [Webpack](https://www.npmjs.com/package/webpack) and [Browserify](https://www.npmjs.com/package/browserify)!

## Features
* Getting proxy lists
  * An API to get HTTP, HTTPS, and SOCKS proxies
  * Easily filter by country, speed, and anonymity level
  * Request multiple proxies at a time
* Check your public IP
  * Blazingly fast public IP check
  * Use this to confirm you are connected through the proxy!
  * Use option `extended=true` to see country, city, zip code, and latitude/longitude for the IP as well.

### Getting an API key
You can use so much of `proxifly` for free, but if you want to do some advanced stuff, you'll need an API key. You can get one by [signing up for a Proxifly account](https://proxifly.dev/authentication/signup).

## Install Proxifly
### Install via npm
Install with npm if you plan to use `proxifly` in a Node project or in the browser.
```shell
npm install proxifly
```
If you plan to use `proxifly` in a browser environment, you will probably need to use [Webpack](https://www.npmjs.com/package/webpack), [Browserify](https://www.npmjs.com/package/browserify), or a similar service to compile it.

```js
const proxifly = new (require('proxifly'))({
  // Not required, but having one removes limits (get your key at https://proxifly.dev).
  apiKey: 'api_test_key'
});
```

### Install via CDN
Install with CDN if you plan to use Proxifly only in a browser environment.
```html
<script src="https://cdn.jsdelivr.net/npm/proxifly@latest/dist/index.min.js"></script>
<script type="text/javascript">
  var proxifly = new Proxifly({
    // Not required, but having one removes limits (get your key at https://proxifly.dev).
    apiKey: 'api_test_key'
  });
</script>
```

### Use without installation
You can use `proxifly` in a variety of ways that require no installation, such as `curl` in terminal/shell. See the **Use without installation** section below.

## Using Proxifly
After you have followed the install step, you can start using `proxifly` to get proxy lists and check your public IP!
### getProxy()
Retrieves a fully filterable list of proxies in either `json` or plain `text`.
```js
var options = {
  protocol: 'http', // http | socks4 | socks5
  anonymity: 'elite', // transparent | anonymous | elite
  country: 'US', // https://www.nationsonline.org/oneworld/country_code_list.htm
  https: true, // true | false
  speed: 10000, // 0 - 60000
  format: 'json', // json | text
  quantity: 1, // 1 - 20
};

proxifly.getProxy(options)
.then(proxy => {
  console.log('getProxy:', proxy);
  // If you specify a quantity greater than 1, the response will be an array!
  // In this case, you can access by calling response[0].ipPort, response[1].ipPort, etc...
})
.catch(e => {
  console.error(e);
})
```

### options
The options for `getProxy(options)` are as follows.
* protocol `string`, `array` (optional): Filter by the protocol
  * Values: `http`, `socks4`, `socks5`
  * Default: `http`
* anonymity `string`, `array` (optional): Filter by anonymity level.
  * Values: `transparent`, `anonymous`, `elite` (`elite` is the most anonymous)
  * Default: `null` (no filter, any anonymity)
* country `string`, `array` (optional): Filter by country.
  * Values: `US`, `CA`, `RU`... (see full list at https://www.nationsonline.org/oneworld/country_code_list.htm)
  * Default: `null` (no filter, any country)
* https `boolean` (optional): Filter by https/SSL.
  * Values: `true`, `false`
  * Default: `null` (no filter, any level of https)  
* speed `number` (optional): Filter by speed, value is in _milliseconds_ taken to connect.
  * Values: `0` - `60000`
  * Default: `null` (no filter, any speed)
  * Note: Specifying a very low number (less than ~400) will return significantly fewer results
* format `string` (optional): The response type.
  * Values: `json`,  `text`  
  * Default: `json`
* quantity `number` (optional): The number of proxies to be returned. Any number greater than `1` will be returned in an `array`.
  * Values: `1` - `20`  
  * Default: `1`
  * Note: Without an API key, you cannot return more than `1` result.

For most options like `protocol`, `anonymity`, and `country`, you can provide an `array` where each element in the array will act as `OR` logic.
For example:
```js
var options = {
  protocol: ['http', 'socks4'],
  anonymity: ['anonymous', 'elite'],
  country: ['US', 'GB', 'RU'],
}
```
This filter will call the API for any proxies that are either of protocol (`http` OR `socks4`) AND of anonymity (`anonymous` OR `elite`) AND from (`US` OR `GB` OR `RU`)!

### Example output
Here is a sample response for the `.getProxy()` method. This is the output you will see when `extended=true`:
```js
{
  "ip": "209.99.133.59",
  "port": "12345",
  "anonymity": "anonymous",
  "userAgent": true,
  "country": "US",
  "get": true,
  "post": true,
  "ipPort": "209.99.133.59:12345",
  "cookies": true,
  "protocol": "http",
  "https": true,
  "referrer": true
}
```

### getPublicIp()
Get your public IP with a simple api call.
```js
var options = {
  mode: 'IPv4', // IPv4 | IPv6
  format: 'json', // json | text
};

proxifly.getPublicIp(options)
.then(proxy => {
  console.log('getPublicIp:', response);
  console.log('My IP is:', response.ip);
  console.log('My country is:', response.country);
})
.catch(e => {
  console.error(e);
})
```
### options
The options for `getProxy(options)` are as follows.
* mode `string` (optional): IPv4 IP or IPv6 IP?
  * Values: `IPv4`,  `IPv6`  
  * Default: `IPv4`
* format `string` (optional): The response type.
  * Values: `json`,  `text`  
  * Default: `json`


### Example output
Here is a sample response for the `.getPublicIp()` method. This is the output you will see when `extended=true`:
```js
{
  "ip": "73.111.121.217",
  "country": "US",
  "state": "California",
  "city": "San Francisco",
  "district": "Lower Nob Hill",
  "zipcode": "94109",
  "latitude": "37.88619",
  "longitude": "-122.42311",
  "isp": "Comcast Cable Communications, LLC"
}
```

For a more in-depth documentation of this library and the Proxifly service, please visit the official Proxifly website.

## Use without installation
### Use Proxifly with `curl`
```shell
# Get public IP
# Standard
curl -X POST https://api.proxifly.dev/get-public-ip
# With options
curl -d "format=text&mode=ipv4" -X POST https://api.proxifly.dev/get-public-ip
# With options (alternative)
curl -d '{"format": "text", "mode": "ipv4"}' -H 'Content-Type: application/json' https://api.proxifly.dev/get-public-ip

# Get a proxy
# Standard
curl -X POST https://api.proxifly.dev/get-proxy
# With options
curl -d "format=text&protocol=http&quantity=3" -X POST https://api.proxifly.dev/get-proxy
# With options (alternative)
curl -d '{"format": "text", "protocol": ["http", "socks4"], "quantity": 3}' -H 'Content-Type: application/json' https://api.proxifly.dev/get-proxy

```

## What Can Proxifly do?
[Proxifly is a free proxy api](https://proxifly.dev) that helps you get free proxy lists and check your public IP.

## Final Words
If you are still having difficulty, we would love for you to post
a question to [the Proxifly issues page](https://github.com/proxifly/proxifly/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## Projects Using this Library
[Somiibo](https://somiibo.com/): A Social Media Bot with an open-source module library. <br>
[JekyllUp](https://jekyllup.com/): A website devoted to sharing the best Jekyll themes. <br>
[Slapform](https://slapform.com/): A backend processor for your HTML forms on static sites. <br>
[SoundGrail Music App](https://app.soundgrail.com/): A resource for producers, musicians, and DJs. <br>
[Hammock Report](https://hammockreport.com/): An API for exploring and listing backyard products. <br>

Ask us to have your project listed! :)
