/**
 * Created by kyowang on 2017/7/11.
 */
'use strict';

class ChromedriverVersion {
  constructor () {
    this.defaultVersion = '2.20';
    this.versionMap = [
      {chromedriverVersion: '2.30', webviewVersions: [58, 60]},
      {chromedriverVersion: '2.28', webviewVersions: [55, 57]},
      {chromedriverVersion: '2.26', webviewVersions: [53, 55]},
      {chromedriverVersion: '2.23', webviewVersions: [51, 53]},
      {chromedriverVersion: '2.21', webviewVersions: [46, 50]},
      {chromedriverVersion: '2.20', webviewVersions: [43, 48]},
      {chromedriverVersion: '2.14', webviewVersions: [39, 42]},
      {chromedriverVersion: '2.12', webviewVersions: [36, 40]}
    ];
  }

  // get chromedriver version from webview version
  // if nothing match. return default version 2.20
  getVersionFromWebviewVersion (webviewVersion) {
    if (!webviewVersion) {
      return this.defaultVersion;
    }
    for (var i = 0; i < this.versionMap.length; i++) {
      if (webviewVersion >= this.versionMap[i].webviewVersions[0] && webviewVersion <= this.versionMap[i].webviewVersions[1]) {
        return this.versionMap[i].chromedriverVersion;
      }
    }
    return this.defaultVersion;
  }

  // get an array of chromedriver versions which we need install at the very moment of installation.
  getVersions () {
    var arr = [];
    for (var i = 0; i < this.versionMap.length; i++) {
      arr.push(this.versionMap[i].chromedriverVersion);
    }
    return arr;
  }
}
ChromedriverVersion.defaultVersion = '2.20';
module.exports = ChromedriverVersion;