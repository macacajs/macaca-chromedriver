'use strict';

var ChromeDriver = require('..');
var detectPort = require('detect-port');

describe('test', function() {
  it('should be ok', function() {
    ChromeDriver.should.be.ok();
  });

  it('should start success', function *() {
    var proxyPort = yield detectPort(9515);
    var chromedriver = new ChromeDriver({
      proxyPort: proxyPort
    });

    chromedriver.should.be.ok();

    try {
      yield chromedriver.start({
        browserName: 'chrome'
      });
    } catch (e) {
      console.log(err);
    }
  });
});
