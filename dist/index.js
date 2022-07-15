(function (root, factory) {
  // https://github.com/umdjs/umd/blob/master/templates/returnExports.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  var environment = (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') ? 'node' : 'browser';

  var ERROR_DEFAULT = 'There was an unknown error';
  var ERROR_NO_PROXY = 'No proxy provided';
  var ERROR_ON_LIST = 'Proxy is already in verification queue';
  var ERROR_RECENT = 'Proxy was recently verified';
  var ERROR_TIMEOUT = 'The request timed out';
  var SOURCE = 'library';
  var VERSION = '1.0.17';

  function Proxifly(options) {
    // options = options || {};
    this.options = options || {};
    this.options.environment = this.options.environment || environment;
    this.options.apiKey = this.options.apiKey || '';
    this.options.debug = typeof this.options.debug !== 'undefined' ? this.options.debug : false;
    // this.options.tags = typeof this.options.tags !== 'undefined' ? this.options.tags : undefined;
    if (this.options.debug) {
      console.log('Proxifly options:', this.options);
    }
    this._verifiedProxyList = [];
    this._verifiedProxyListTimes = [];
  };

  var parse = function (req) {
    var result;
    try {
      result = JSON.parse(req);
    } catch (e) {
      result = req;
    }
    return [result, req];
  };

  Proxifly.prototype.getProxy = function(options) {
    var This = this;
    options = options || {};
    options.config = options.config || {};
    options.format = (options.format || 'json').toLowerCase();
    options.apiKey = This.options.apiKey;
    // payload.endpoint = payload.endpoint || 'api.proxifly.com';
    var conf = {
      host: options.config.host || 'api.proxifly.com',
      path: options.config.path || '/get-proxy',
      protocol: options.config.protocol || 'https://',
      method: 'POST'
    }

    return new Promise(function(resolve, reject) {
      return serverRequest(This, conf, options, function (response) {
        if (response.error) {
          return reject(response.error);
        } else {
          return resolve(response.response);
        }
      })
    })
  }

  Proxifly.prototype.getPublicIp = function(options) {
    var This = this;
    options = options || {};
    options.mode = (options.mode || 'IPv4').toLowerCase();
    options.method = (options.method || 'POST').toUpperCase();
    options.service = (options.service || 'proxifly').toLowerCase();
    options.format = (options.format || 'json').toLowerCase();
    options.timeout = typeof options.timeout !== 'undefined' ? options.timeout : 60000;
    options.apiKey = This.options.apiKey;

    var conf = {
      host: (options.mode === 'ipv6') ? 'api6.ipify.org' : 'api.proxifly.com',
      path: (options.mode === 'ipv6') ? '/' : '/get-public-ip',
      method: (options.mode === 'ipv6') ? 'GET' : 'POST',
      service: options.service,
    };
    if (conf.service === 'ipify') {
      conf.method = 'GET';
      conf.host = (options.mode === 'ipv6') ? 'api6.ipify.org' : 'api.ipify.org';
      conf.path = (options.format === 'json') ? '/?format=json' : '/';
    } else if (conf.service === 'ifconfig') {
      conf.method = 'GET';
      conf.host = 'ifconfig.co';
      conf.path = (options.format === 'json') ? '/json' : 'ip';
    }

    return new Promise(function(resolve, reject) {
      setTimeout(function () {
        return reject(new Error(ERROR_TIMEOUT));
      }, options.timeout);
      return serverRequest(This, conf, options, function (response) {
        // console.log('---response.error', response.error);

        if (response.error) {
          return reject(response.error);
        } else {
          return resolve(ipvxFix(options, response));
        }
      })
    })

  }

  function ipvxFix(options, response) {
    var res = {};
    if (options.format === 'json') {
      // console.log('response', response);
      // console.log('response.response', response.response);
      res.ip = (options.mode === 'ipv4') ? response.response.ip : response.response;
      if (response.response.country_iso || response.response.country) {res.country = response.response.country_iso || response.response.country};
    } else {
      res = response.response;
    }
    return res;
  }


  Proxifly.prototype.verifyProxy = function(options) {
    var This = this;
    options = options || {};
    // options.format = (options.format || 'json').toLowerCase();
    options.apiKey = This.options.apiKey;
    options.batchSize = options.batchSize || 20;
    options.throttleMin = options.throttleMin || 15;
    var conf = {host: 'api.proxifly.com', path: '/verify-proxy', method: 'POST'}

    // Clean list
    This._verifiedProxyListTimes = This._verifiedProxyListTimes.filter(function(item, index) {
      return _wasFromLastNMin(item.timestamp, options.throttleMin);
    })

    var exists = This._verifiedProxyList.find(function (item) {
      return item && item.proxy === options.proxy;
    })
    var recentlyVerified = This._verifiedProxyListTimes.find(function (item) {
      return item && (item.proxy === options.proxy) && _wasFromLastNMin(item.timestamp, options.throttleMin);
    })

    // console.log('----result', options.proxy, 'recentlyVerified=', !!recentlyVerified, 'exists=', !!exists,);

    return new Promise(function(resolve, reject) {
      if (exists) {
        return reject(new Error(ERROR_ON_LIST))
      } else if (recentlyVerified) {
        return reject(new Error(ERROR_RECENT))
      } else if (!options.proxy) {
        return reject(new Error(ERROR_NO_PROXY))
      }
      var size = This._verifiedProxyList.length;

      addProxyToVerifiedList(This, options);

      if (size >= options.batchSize - 1) {
        setTimeout(function () {
          This._verifiedProxyList = [];
        }, 1);
        // console.log('---Sending to server...', This._verifiedProxyList);
        return serverRequest(This, conf, This._verifiedProxyList, function (response) {
          // console.log('---response', response.response);
          if (response.error) {
            return reject(response.error);
          } else {
            // This._verifiedProxyList = [];
            return resolve(response.response);
          }
        })
      } else {
        // console.log('----options', options);
        return resolve('Waiting for batch size to accumulate: ' + size + '/' + options.batchSize);
      }

    })
  }

  function addProxyToVerifiedList(This, payload) {
    This._verifiedProxyList = This._verifiedProxyList.concat(payload);
    This._verifiedProxyListTimes = This._verifiedProxyListTimes.concat({
      proxy: payload.proxy,
      timestamp: new Date(),
    });
  }

  function _wasFromLastNMin(time, min) {
    return ((Math.abs(time - new Date()) / (1000 * 60)) < min)
  }

  function serverRequest(This, reqObj, payload, callback) {
      var content = 'application/json';

      payload._version = VERSION;
      payload._source = SOURCE;
      payload._referrer = getLocation();

      if (This.options.environment === 'browser') {
        var addy = (reqObj.protocol || 'https://') + reqObj.host + reqObj.path;
        // var addy = 'http://localhost:5000/get-proxy';
        if (This.options.debug) {
          console.log('Browser request...', addy);
        }
        var XHR = window.XMLHttpRequest || XMLHttpRequest || ActiveXObject;
        var request = new XHR('MSXML2.XMLHTTP.3.0');

        request.open(reqObj.method, addy, true);
        request.setRequestHeader('Content-type', content);
        request.setRequestHeader('Accept', content);
        // request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.onreadystatechange = function () {
          var req;
          if (request.readyState === 4) {
            // console.log('--1', request);
            req = parse(request.responseText);
            if (request.status >= 200 && request.status < 300) {
              // console.log('SUCCESS', request);
              // console.log('--2');
              callback({error: null, request: request, response: req[0]})
            } else {
              // console.log('ERROR', request);
              // console.log('--3');
              callback({error: new Error(parse(request.responseText)[0] || ERROR_DEFAULT), request: request});
            }
          }
        };

        payload = stringifyData(payload);

        request.send(payload);

      } else {
        var options = {
          hostname: reqObj.host,
          // hostname: 'localhost',
          // hostname: 'api.INCORRECTTEST.com',
          // port: 443,
          // port: 5000,
          path: reqObj.path,
          method: reqObj.method,
          headers: {
            'Content-Type': content,
            'Accept': content,
          }
        };
        if (This.options.debug) {
          console.log('Node request...', options);
        }
        var https = require('https');

        var globalRes;
        var full = '';
        var req = https.request(options, function(res) {
          globalRes = res;

          res.on('data', function(chunk) {
            full += chunk;
          });
          res.on('end', function() {
            var resData = parse(full.toString())[0];
            // console.log('--1', res);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              callback({error: null, request: req, response: resData});
            } else {
              callback({error: resData || res.statusMessage || 'Unknown error.', request: req});
            }
          });

        });
        req.on('error', function(e) {
          callback({error: e, request: req});
        });

        payload = stringifyData(payload);
        req.write(payload);
        req.end();
      }
  }

  function getLocation() {
    try {
      return window.location.href;
    } catch (e) {
      return null;
    }
  }

  function stringifyData(data) {
    // if ((contentType.indexOf('json') > -1)) {
    // var response = data;
      try {
        data = JSON.stringify(data);
      } catch (e) {
        console.error('Could not stringify data.');
      }
      return data;
    // }
  }

  // Register
  if (environment === 'browser') {
    try {
      window.Proxifly = Proxifly;
    } catch (e) {
    }
  }

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return Proxifly; // Enable if using UMD

}));
