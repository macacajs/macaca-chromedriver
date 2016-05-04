'use strict';

var ChromeDriver = require('..');
var detectPort = require('detect-port');

describe('test', function() {
  it('should be ok', function() {
    ChromeDriver.should.be.ok;
  });

  it('should start success', function *(done) {
    var proxyPort = yield detectPort(9515);
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

    chromedriver.start({ 'browserName': 'chrome' }).catch(err => {
      console.log(err);
      setTimeout(function() {
        throw err;
      });
    });
  });
});
