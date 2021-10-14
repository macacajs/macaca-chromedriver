'use strict';

const assert = require('assert');
const detectPort = require('detect-port');

const ChromeDriver = require('..');
const _ = require('../lib/helper');

describe('test', function() {
  this.timeout(5 * 60 * 1000);
  const proxyPort = detectPort(9515);
  const chromedriver = new ChromeDriver({
    proxyPort: proxyPort
  });

  before(async () => {
    chromedriver.start({
      browserName: 'chrome'
    });
    // browser needs some time to start up
    await _.sleep(4000);
  });

  it('should be ok', () => {
    assert.ok(chromedriver);
  });

  it('get status', async () => {
    const status = await chromedriver.getStatus();
    assert(status.value && status.value.ready);
  });

  after(async () => {
    chromedriver.stop();
    let cmd = '';
    if (_.platform.isOSX) {
      cmd = 'ps -ef | grep -i Chrome | grep -v grep  | grep -e \'remote-debugging-port\' | awk \'{ print $2 }\' | xargs kill -15';
    } else if (_.platform.isLinux) {
      cmd = 'ps -ef | grep -i Chrome | grep -v grep  | grep -e \'remote-debugging-port\' | awk \'{ print $2 }\' | xargs -r kill -15';
    }
    _.exec(cmd);
  });
});
