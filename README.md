<p align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/proxifly/images/logo/proxifly-brandmark-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/proxifly/images/logo/proxifly-brandmark-black-x.svg">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/proxifly/proxifly.svg">
  <br>
  <img src="https://img.shields.io/david/proxifly/proxifly.svg">
  <img src="https://img.shields.io/david/dev/proxifly/proxifly.svg">
  <img src="https://img.shields.io/bundlephobia/min/proxifly.svg">
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/proxifly/proxifly.svg">
  <img src="https://img.shields.io/npm/dm/proxifly.svg">
  <img src="https://img.shields.io/node/v/proxifly.svg">
  <img src="https://img.shields.io/website/https/proxifly.com.svg">
  <img src="https://img.shields.io/github/license/proxifly/proxifly.svg">
  <img src="https://img.shields.io/github/contributors/proxifly/proxifly.svg">
  <img src="https://img.shields.io/github/last-commit/proxifly/proxifly.svg">
  <br>
  <br>
  <a href="https://proxifly.com">Site</a> | <a href="https://www.npmjs.com/package/proxifly">NPM Module</a> | <a href="https://github.com/proxifly/proxifly">GitHub Repo</a>
  <br>
  <br>
  <strong>proxifly</strong> is the official npm module of <a href="https://proxifly.com">Proxifly</a>, a free service to get SOCKS, HTTP, & HTTPS proxies as well as to check your public IP!
</p>

## Proxifly Works in Node AND browser environments
Yes, this module works in both Node and browser environments, including compatability with [Webpack](https://www.npmjs.com/package/webpack) and [Browserify](https://www.npmjs.com/package/browserify)!

## Features
* Getting proxy lists
  * An API to get HTTP, HTTPS, and SOCKS proxies
  * Easily filter by country, speed, and anonymity level
* Check your public IP
  * Blazingly fast public IP check
  * Use this to confirm you are connecting through the proxy!

### Getting an API key
You can use so much of `proxifly` for free, but if you want to do some advanced stuff, you'll need an API key. You can get one by signing up for an account at [https://proxifly.com/signup](https://proxifly.com/signup).

## Install Proxifly
### Install via npm
Install with npm if you plan to use `proxifly` in a Node project or in the browser.
```shell
npm install proxifly
```
If you plan to use `proxifly` in a browser environment, you will probably need to use [Webpack](https://www.npmjs.com/package/webpack), [Browserify](https://www.npmjs.com/package/browserify), or a similar service to compile it.

```js
const proxifly = new (require('proxifly'))({
  apiKey: 'api_test_key' // Not required, but having one removes limits (get your key at https://proxifly.com).
});
```

### Install via CDN
Install with CDN if you plan to use Proxifly only in a browser environment.
```html
<script src="https://cdn.jsdelivr.net/npm/proxifly"></script>
<script type="text/javascript">
  var proxifly = new Proxifly({
    apiKey: 'api_test_Key' // Not required, but having one removes limits (get your key at https://proxifly.com).
  });
</script>
```


## Using Proxifly
After you have followed the install step, you can start using `proxifly` to get proxy lists and check your public IP!
### getProxy()
Retrieves a fully filterable list of proxies in either `json` or plain `text`.
```js
var options = {
  protocol: 'https', // http | https | socks4 | socks4a | socks5 | socks5h
  anonymity: 'elite', // transparent | anonymous | elite
  country: 'US', // https://www.nationsonline.org/oneworld/country_code_list.htm
  speed: 10000, // 0 - 60000
  format: 'json', // json | text
  quantity: 1, // 1 - 20
};
proxifly.getProxy(options, function (error, response) {
  console.log('getProxy:', response);
  console.log('response IP:', response.ipPort);
  // If you specify a quantity greater than 1, the response will be an array!
  // In this case, you can access by calling response[0].ipPort, response[1].ipPort, etc...
});
```
### options
The options for `getProxy(options)` are as follows.
* protocol `string` (optional): Filter by the protocol
  * Values: `http`, `https`, `socks4`, `socks4a`, `socks5`, `socks5h`
  * Default: `https`
* anonymity `string` (optional): Filter by anonymity level.
  * Values: `transparent`, `anonymous`, `elite` (`elite` is the most anonymous)
  * Default: `transparent`
* country `string` (optional): Filter by country.
  * Values: `US`, `CA`, `RU`... (see full list at https://www.nationsonline.org/oneworld/country_code_list.htm)
  * Default: `US`
* speed `number` (optional): Filter by speed, value is in _milliseconds_ taken to connect.
  * Values: `0` - `60000`
  * Default: `10000`
  * Note: Specifying a very low number (less than ~400) will return significantly fewer results
* quantity `format` (optional): The response type.
  * Values: `json`,  `text`  
  * Default: `json`
* quantity `number` (optional): The number of proxies to be returned. Any number greater than `1` will be returned in an `array`.
  * Values: `1` - `20`  
  * Default: `1`
  * Note: Without an API key, you cannot return more than `1` result.

### getPublicIp()
Get your public IP with a simple api call.
```js
var options = {
  mode: 'IPv4', // IPv4 | IPv6
  format: 'json', // json | text
};
proxifly.getPublicIp(options, function (error, response) {
  console.log('getPublicIp:', response);
  console.log('My IP is:', response.ip);
  console.log('My country is:', response.country);
});
```
### options
The options for `getProxy(options)` are as follows.
* quantity `mode` (optional): IPv4 IP or IPv6 IP?
  * Values: `IPv4`,  `IPv6`  
  * Default: `IPv4`
* quantity `format` (optional): The response type.
  * Values: `json`,  `text`  
  * Default: `json`


## Extending Capabilities
### Using Proxifly with promises
We built `proxifly` to have optional `Promises` support because we know not everyone uses an environment that supports `Promises`.You can **easily** enable this with one additional option.
```js
const proxifly = new (require('proxifly'))({
  promises: true, // enable Promises instead of callbacks
  // ... your other options here too
});

proxifly.getProxy({format: 'json'})
.then(function (response) {
  console.log('A fresh proxy:', response);
})
.catch(function (error) {
  console.error('Error:', error);
})


proxifly.getPublicIp({format: 'json'})
.then(function (response) {
  console.log('My public IP is:', response);
})
.catch(function (error) {
  console.error('Error:', error);
})
```

For a more in-depth documentation of this library and the Proxifly service, please visit the official Proxifly website.

## What Can Proxifly do?
[Proxifly is a free proxy api](https://proxifly.com) that helps you get free proxy lists and check your public IP.

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
