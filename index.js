(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    // define(['b'], factory);
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    // module.exports = factory(require('b'));
    module.exports = factory('node');
  } else {
    // Browser globals (root is window)
    // root.returnExports = factory(root.b);
    root.returnExports = factory('browser');
  }
}(this, function (environment) {
  environment = environment || 'node';
  // attach properties to the exports object to define
  // the exported module properties.

  this.extra = '8'; //@@@ Delete later

  // if ((typeof window !== 'undefined') && (window.XMLHttpRequest || XMLHttpRequest || ActiveXObject)) {
  //   environment = 'browser';
  // }
  environment = (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') ? 'node' : 'browser';

  if (environment == 'browser') {
    registerName();
  }

  function registerName() {
    try {
      window.Proxifly = Proxifly;
    } catch (e) {
    }
  }

  function Proxifly(options) {
    // options = options || {};
    this.options = options || {};
    this.options.environment = this.options.environment || environment;
    this.options.apiKey = this.options.apiKey || '';
    this.options.debug = typeof this.options.debug !== 'undefined' ? this.options.debug : false;
    this.options.promises = typeof this.options.promises !== 'undefined' ? this.options.promises : false;
    // this.options.tags = typeof this.options.tags !== 'undefined' ? this.options.tags : undefined;
    if (this.options.debug) {
      console.log('Proxifly options:', this.options);
    }
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

  var parseDELETE = function (req) {
    var result;
    try {
      result = JSON.parse(req.responseText);
    } catch (e) {
      result = req.responseText;
    }
    return [result, req];
  };

  Proxifly.prototype.getProxy = function(options, callback) {
    var This = this;
    options = options || {};
    options.format = (options.format || 'json').toLowerCase();
    var conf = {host: 'api.proxifly.com', path: '/getProxy', method: 'POST'}

    if (This.options.promises) {
      return new Promise(function(resolve, reject) {
        return serverRequest(This, conf, options, function (response) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.response);
          }
        })
      })
    } else {
      return serverRequest(This, conf, options, function (response) {
        return callback ? callback(response.error, response.response) : response;
      })
    }
  }

  Proxifly.prototype.getPublicIp = function(options, callback) {
    var This = this;
    options = options || {};
    options.mode = (options.mode || 'IPv4').toLowerCase();
    options.method = (options.method || 'POST').toUpperCase();
    options.service = (options.service || 'proxifly').toLowerCase();
    options.format = (options.format || 'json').toLowerCase();
    options.timeout = typeof options.timeout !== 'undefined' ? options.timeout : 0;
    var conf = {
      host: (options.mode == 'ipv6') ? 'api6.ipify.org' : 'api.proxifly.com',
      path: (options.mode == 'ipv6') ? '/' : '/getPublicIp',
      method: (options.mode == 'ipv6') ? 'GET' : 'POST',
      service: (options.service == 'proxifly') ? 'proxifly' : 'ipify',
    };
    if (conf.service == 'ipify') {
      conf.method = 'GET';
      conf.host = (options.mode == 'ipv6') ? 'api6.ipify.org' : 'api.ipify.org';
      conf.path = '/';
    }

    if (This.options.promises) {
      return new Promise(function(resolve, reject) {
        return serverRequest(This, conf, options, function (response) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(ipvxFix(options, response));
          }
        })
      })
    } else {
      return serverRequest(This, conf, options, function (response) {
        var res = (!response.error) ? ipvxFix(options, response) : {};
        return callback ? callback(response.error, res) : response;
      })
    }

  }

  function ipvxFix(options, response) {
    var res = {};
    if (options.format == 'json') {
      res.ip = (options.mode == 'ipv4') ? response.response.ip : response.response;
    } else {
      res = response.response;
    }
    return res;
  }

  // Proxifly.prototype.getPublicIp = function(options, callback) {
  //   var This = this;
  //   options = options || {};
  //   options.mode = (options.mode || 'IPv4').toLowerCase();
  //   options.format = (options.format || 'json').toLowerCase();
  //   var host = (options.mode == 'ipv4') ? 'api.proxifly.com' : 'api6.ipify.org';
  //   var path = (options.mode == 'ipv4') ? '/getPublicIp' : '/';
  //   var method = (options.mode == 'ipv4') ? 'POST' : 'GET';
  //
  //   return serverRequest(This, {host: host, path: path, method: method}, options, function (response) {
  //     if (!response.error) {
  //       var res = {};
  //       if (options.format == 'json') {
  //         res.ip = (options.mode == 'ipv4') ? response.response.ip : response.response;
  //       } else {
  //         res = response.response;
  //       }
  //       return callback ? callback(response.error, res) : response;
  //
  //       // return callback ? callback({error: response.error, data: res}) : response;
  //     } else {
  //       return callback ? callback(response.error) : response;
  //       // return callback ? callback({error: response.error}) : response;
  //     }
  //   })
  // }

  function serverRequest(This, reqObj, payload, callback) {
      var content = 'application/json';
      if (This.options.environment == 'browser') {
        var addy = 'https://' + reqObj.host + reqObj.path;
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
            // console.log('request', request);
            req = parse(request.responseText);
            // console.log('req', req);
            if (request.status >= 200 && request.status < 300) {
              callback({error: false, request: request, response: req[0]})
              // return {error: false, req: resData, res: resData[0]};
              // resolve([req, req[]]);
            } else {
              callback({error: true, request: request});
              // return {error: true, req: resData};
              // reject({req: req});
            }
          }
        };

        payload = stringifyData(payload);

        request.send(payload);
      } else {
        var options = {
          hostname: reqObj.host,
          // hostname: 'api.INCORRECTTEST.com',
          // port: 443,
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
            // console.log('END > ', full.toString());
            // var resData = JSON.parse(full.toString());
            // console.log('options', This.options);
            // console.log('full', full);
            // console.log('full.toString()', full.toString());
            // console.log('JSON.parse(full)', JSON.parse(full));
            // console.log('parse(full)', parse(full));
            var resData = parse(full.toString())[0];
            // console.log(resData[0], resData[1]);

            // console.log('resData', resData);
            if (resData) {
              callback({error: false, request: req, response: resData});
              // return {error: false, req: resData, res: resData[0]};
              // resolve({req: resData, response: resData[0]});
            } else {
              callback({error: true, request: req});
              // return {error: true, req: resData};
              // reject({req: resData});
            }
          });

        });
        req.on('error', function(e) {
          reject(e);
        });

        payload = stringifyData(payload);
        req.write(payload);
        req.end();
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

  return Proxifly; // Enable if using UMD
  // module.exports = Proxifly; // Enable if using regular module.exports
}));
