/* ================================================================
 * macaca-chromedriver by xdf(xudafeng[at]126.com)
 *
 * first created at : Fri Sep 11 2015 00:49:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2013 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var ChromeDriver = require('..');
var detectPort = require('detect-port');

describe('test', function() {
  it('should be ok', function() {
    ChromeDriver.should.be.ok;
  });

  it('should start success', function *(done) {
    var proxyPort = yield detectPort(9515);
    console.log(`port: ${proxyPort}`);
    var chromedriver = new ChromeDriver({
      proxyPort: proxyPort
    });

    chromedriver.should.be.ok;

    try {
      yield chromedriver.killAll();
    } catch (e) {
      console.log(e);
    }

    chromedriver.on(ChromeDriver.EVENT_READY, data => {
      console.log(`chromedriver ready with: ${JSON.stringify(data)}`);
      done();
    });

    chromedriver.start({});
  });
});
