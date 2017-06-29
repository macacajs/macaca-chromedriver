'use strict';

const request = require('request');

const _ = require('./helper');
const logger = require('./logger');

class DriverProxy {
  constructor(options) {
    Object.assign(this, {
      scheme: 'http',
      urlBase: 'wd/hub',
      sessionId: null,
      originSessionId: null
    }, options);
  }

  handleNewUrl(url) {
    const sessionReg = /\/session\/([^\/]+)/;
    const wdSessionReg = new RegExp(`${this.urlBase}\/session\/([^\/]+)`);
    url = `${this.scheme}://${this.proxyHost}:${this.proxyPort}/${this.urlBase}${url}`;

    if (sessionReg.test(url) && this.sessionId) {
      this.originSessionId = url.match(sessionReg)[1];
      url = url.replace(wdSessionReg, `session/${this.sessionId}`);
    }
    return url;
  }

  send(url, method, body) {
    return new Promise((resolve, reject) => {
      method = method.toUpperCase();
      const newUrl = this.handleNewUrl(url);

      const reqOpts = {
        url: newUrl,
        method: method,
        headers: {
          'Content-type': 'application/json;charset=UTF=8'
        },
        resolveWithFullResponse: true
      };

      if (body) {
        if (typeof body !== 'object') {
          body = JSON.parse(body);
        }
        reqOpts.json = body;
      }

      logger.debug(`Proxy: ${url}:${method} to ${newUrl}:${method} with body: ${_.trunc(JSON.stringify(body), 200)}`);

      request(reqOpts, (error, res, body) => {
        if (error) {
          return reject(new Error(`chromedriver proxy error with: ${error}`));
        }
        logger.debug(`Got response with status ${res.statusCode}: ${_.trunc(JSON.stringify(body), 200)}`);

        if (typeof body !== 'object') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            logger.debug(`Fail to parse body: ${e}`);
          }
        }

        if (body.sessionId) {
          this.sessionId = body.sessionId;
          body.sessionId = this.originSessionId;
        }
        resolve(body);
      });
    });
  }
}

module.exports = DriverProxy;
