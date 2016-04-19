/* ================================================================
 * macaca-chromedriver by xdf(xudafeng[at]126.com)
 *
 * first created at : Fri Sep 11 2015 00:49:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const _ = require('./helper');
const logger = require('./logger');
const request = require('request');
const STATUS = require('webdriver-dfn-error-code');

class Proxy {
  constructor(options) {
    Object.assign(this, {
      scheme: 'http',
      proxyHost: '127.0.0.1',
      proxyPort: 9515,
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

      logger.info(`Proxy: ${url}:${method} to ${newUrl}:${method} with body: ${_.trunc(JSON.stringify(body), 200)}`);

      request(reqOpts, (error, res, body) => {
        if (error) {
          return reject(new Error(`chromedriver proxy error with: ${error}`));
        }
        logger.info(`Got response with status ${res.statusCode}: ${_.trunc(JSON.stringify(body), 200)}`);

        if (body.sessionId) {
          this.sessionId = body.sessionId;
          body.sessionId = this.originSessionId;
        }
        resolve(body);
      });
    });
  }
}

module.exports = Proxy;
