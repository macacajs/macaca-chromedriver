'use strict';

var assert = require('assert');
var ChromeDriver = require('..');
var detectPort = require('detect-port');

describe('test', function() {
  it('should be ok', function() {
    assert.ok(ChromeDriver);
  });

  it('should start success', function *() {
    var proxyPort = yield detectPort(9515);
    var chromedriver = new ChromeDriver({
      proxyPort: proxyPort
    });

    assert.ok(chromedriver);

    try {
      yield chromedriver.start({
        browserName: 'chrome'
      });
    } catch (err) {
      console.log(err);
    }
  });
});
