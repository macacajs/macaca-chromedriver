/**
 * Created by kyowang on 2017/7/11.
 */
'use strict';

const pkg = require('../package');
const logger = require('./logger');

class ChromedriverVersion {
  constructor() {
    this.defaultVersion = pkg.config.defaultVersion;
    this.versionMap = [
      {
        chromedriverVersion: '2.45',
        webviewVersions: [70, 72]
      },
      {
        chromedriverVersion: '2.36',
        webviewVersions: [63, 70]
      }, {
        chromedriverVersion: '2.36',
        webviewVersions: [62, 64]
      }, {
        chromedriverVersion: '2.33',
        webviewVersions: [60, 62]
      }, {
        chromedriverVersion: '2.30',
        webviewVersions: [58, 60]
      }, {
        chromedriverVersion: '2.28',
        webviewVersions: [55, 57]
      }, {
        chromedriverVersion: '2.26',
        webviewVersions: [53, 55]
      }, {
        chromedriverVersion: '2.23',
        webviewVersions: [51, 53]
      }, {
        chromedriverVersion: '2.21',
        webviewVersions: [46, 50]
      }, {
        chromedriverVersion: '2.20',
        webviewVersions: [43, 48]
      }, {
        chromedriverVersion: '2.14',
        webviewVersions: [39, 42]
      }, {
        chromedriverVersion: '2.12',
        webviewVersions: [36, 40]
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
    for (var i = 0; i < this.versionMap.length; i++) {
      if (webviewVersion >= this.versionMap[i].webviewVersions[0] && webviewVersion <= this.versionMap[i].webviewVersions[1]) {
        return this.versionMap[i].chromedriverVersion;
      }
    }
    logger.error(`No proper chromedriver version found for webview version: ${webviewVersion}!`);
    logger.error(`Use version: ${this.defaultVersion} instead!`);
    return  this.defaultVersion;
  }

  // get an array of chromedriver versions which we need install at the very moment of installation.
  getVersions() {
    var arr = [];
    for (var i = 0; i < this.versionMap.length; i++) {
      arr.push(this.versionMap[i].chromedriverVersion);
    }
    return arr;
  }
}

ChromedriverVersion.defaultVersion = pkg.config.defaultVersion;

module.exports = ChromedriverVersion;
