/**
 * Created by kyowang on 2017/7/11.
 */
'use strict';

const pkg = require('../package');
const logger = require('./logger');

// https://chromedriver.chromium.org/downloads

class ChromedriverVersion {
  constructor() {
    this.defaultVersion = pkg.config.defaultVersion;
    this.versionMap = [
      {
        chromedriverVersion: '95.0.4638.17',
        webviewVersions: '95'
      },
      {
        chromedriverVersion: '94.0.4606.61',
        webviewVersions: '94'
      },
      {
        chromedriverVersion: '93.0.4577.15',
        webviewVersions: '93'
      },
      {
        chromedriverVersion: '92.0.4515.107',
        webviewVersions: '92'
      },
      {
        chromedriverVersion: '91.0.4472.19',
        webviewVersions: '91'
      },
      {
        chromedriverVersion: '90.0.4430.24',
        webviewVersions: '90'
      },
      {
        chromedriverVersion: '89.0.4389.23',
        webviewVersions: '89'
      },
      {
        chromedriverVersion: '88.0.4324.96',
        webviewVersions: '88'
      },
      {
        chromedriverVersion: '87.0.4280.88',
        webviewVersions: '87'
      },
      {
        chromedriverVersion: '86.0.4240.22',
        webviewVersions: '86'
      }, {
        chromedriverVersion: '84.0.4147.30',
        webviewVersions: '84'
      }, {
        chromedriverVersion: '83.0.4103.39',
        webviewVersions: '83'
      }, {
        chromedriverVersion: '81.0.4044.138',
        webviewVersions: '81'
      }, {
        chromedriverVersion: '80.0.3987.106',
        webviewVersions: '80'
      }, {
        chromedriverVersion: '79.0.3945.36',
        webviewVersions: '79'
      }, {
        chromedriverVersion: '78.0.3904.105',
        webviewVersions: '78'
      }, {
        chromedriverVersion: '77.0.3865.40',
        webviewVersions: '77'
      }, {
        chromedriverVersion: '76.0.3809.126',
        webviewVersions: '76'
      }, {
        chromedriverVersion: '75.0.3770.140',
        webviewVersions: '75'
      }, {
        chromedriverVersion: '74.0.3729.6',
        webviewVersions: '74'
      }, {
        chromedriverVersion: '73.0.3683.68',
        webviewVersions: '73'
      }
    ];
  }

  // get chromedriver version from webview version
  // if nothing match. return default version 2.20
  getVersionFromWebviewVersion(webviewVersion) {
    if (!webviewVersion) {
      return this.defaultVersion;
    }
    logger.info(`Chromedriver versions map: \n ${JSON.stringify(this.versionMap, null, 2)}`);
    for (let i = 0; i < this.versionMap.length; i++) {
      if (this.versionMap[i].webviewVersions === webviewVersion) {
        return this.versionMap[i].chromedriverVersion;
      }
      if (webviewVersion >= this.versionMap[i].webviewVersions[0] && webviewVersion <= this.versionMap[i].webviewVersions[1]) {
        return this.versionMap[i].chromedriverVersion;
      }
    }
    logger.error(`No proper chromedriver version found for webview version: ${webviewVersion}!`);
    logger.error(`Use version: ${this.defaultVersion} instead!`);
    return this.defaultVersion;
  }

  // get an array of chromedriver versions which we need install at the very moment of installation.
  getVersions() {
    const arr = [];
    for (let i = 0; i < this.versionMap.length; i++) {
      arr.push(this.versionMap[i].chromedriverVersion);
    }
    return arr;
  }
}

ChromedriverVersion.defaultVersion = pkg.config.defaultVersion;

module.exports = ChromedriverVersion;
