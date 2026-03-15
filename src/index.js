/**
 * Proxifly - Get free HTTPS proxies and check your public IP
 * https://proxifly.dev
 *
 * @version {version}
 */

import WonderfulFetch from 'wonderful-fetch';

const SOURCE = 'library';
const VERSION = '{version}';
const API_HOST = 'https://api.proxifly.dev';

class Proxifly {
  constructor(options = {}) {
    this.options = {
      apiKey: '',
      url: API_HOST,
      debug: false,
      ...options,
    };

    if (this.options.debug) {
      console.log('Proxifly options:', this.options);
    }
  }

  getProxy(options = {}) {
    return request(this, {
      path: '/proxy',
      timeout: options.timeout ?? 60000,
      query: {
        format: (options.format || 'json').toLowerCase(),
        quantity: options.quantity ?? 1,
        protocol: options.protocol,
        anonymity: options.anonymity,
        country: options.country,
        https: options.https,
        _version: VERSION,
        _source: SOURCE,
        _referrer: getLocation(),
      },
    });
  }

  getPublicIp(options = {}) {
    return request(this, {
      path: '/ip',
      timeout: options.timeout ?? 60000,
      query: {
        format: (options.format || 'json').toLowerCase(),
        _version: VERSION,
        _source: SOURCE,
        _referrer: getLocation(),
      },
    });
  }
}

Proxifly.version = VERSION;

async function request(instance, options) {
  const { path, timeout, query } = options;
  const url = `${instance.options.url}${path}`;

  return WonderfulFetch(url, {
    method: 'get',
    response: 'json',
    timeout: timeout,
    query: query,
    authorization: instance.options.apiKey ? `Bearer ${instance.options.apiKey}` : undefined,
    cacheBreaker: false,
    log: instance.options.debug,
  });
}

function getLocation() {
  try {
    return window.location.href;
  } catch (e) {
    return null;
  }
}

if (typeof window !== 'undefined') {
  window.Proxifly = Proxifly;
}

export default Proxifly;
export { Proxifly };
