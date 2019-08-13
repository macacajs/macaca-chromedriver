'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const stream = require('stream');
const AdmZip = require('adm-zip');
const request = require('request');

const _ = require('./helper');
const logger = require('./logger');
const Versions = require('./versions');
const child_process = require('child_process');

const chromedriverVersions = new Versions();

_.sudoUserPermissionDenied();

function getInstalledChromeVersion() {
  const chromeBinPath = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome';
  if (_.isExistedFile(chromeBinPath)) {
    const versionString = child_process
      .spawnSync(chromeBinPath, ['--version'])
      .output.toString();
    const versionMatch = versionString.match(/\d+/g);
    if (versionMatch) {
      return chromedriverVersions.getVersionFromWebviewVersion(parseInt(versionMatch[0], 10));
    }
  }
}

function getDownloadUrl(version) {
  const CDNURL = process.env.CHROMEDRIVER_CDNURL || 'http://chromedriver.storage.googleapis.com';
  let url = util.format('%s/%s/chromedriver_%s.zip', CDNURL, version, _.getExecFile(version));
  logger.info('chromedriver cdn url: %s', url);
  return url;
}

function UnZipStream(distPath) {
  stream.Transform.call(this, {});
  this.data = [];
  this.distPath = distPath;
  this.dataLen = 0;
}

util.inherits(UnZipStream, stream.Transform);

UnZipStream.prototype._transform = function(chunk, encoding, callback) {
  this.data.push(chunk);
  this.dataLen += chunk.length;
  callback();
};

UnZipStream.prototype._flush = function(callback) {
  var buf = new Buffer(this.dataLen);

  for (var i = 0, len = this.data.length, pos = 0; i < len; i++) {
    this.data[i].copy(buf, pos);
    pos += this.data[i].length;
  }

  var zip = new AdmZip(buf);
  zip.extractEntryTo(getExecZipedName(), this.distPath, false, true);
  callback();
};

function getExecZipedName() {
  var fileName = _.platform.isWindows ? 'chromedriver.exe' : 'chromedriver';
  return fileName;
}

function getBinPath(chromedriverVersion) {
  var fileName = _.platform.isWindows ? 'chromedriver' + chromedriverVersion + '.exe' : 'chromedriver' + chromedriverVersion;
  var binPath = path.join(__dirname, '..', 'exec', fileName);
  return binPath;
}

module.exports = function(cdVersion) {
  const platform = process.platform;
  const execFileName = getExecZipedName();
  const installedChromeVersion = getInstalledChromeVersion();

  const version = process.env.CHROMEDRIVER_VERSION || installedChromeVersion || cdVersion || chromedriverVersions.defaultVersion;
  logger.info('version: %s', version);
  const distPath = getBinPath(version);
  const url = getDownloadUrl(version);
  // chromedriver[.exe] file will be unziped to exec/${timestamp}/chromedriver[.exe] first
  // and then moved to exec/chromedriver2.xx[.exe]
  const tempDir = path.join(path.dirname(distPath), (new Date()).valueOf().toString());
  _.mkdir(path.dirname(distPath));
  _.mkdir(tempDir);

  return new Promise((resolve, reject) => {
    // logger.info('Promise executing:' + url);
    request(url)
      .pipe(new UnZipStream(tempDir))
      .on('finish', function() {
        fs.renameSync(path.join(tempDir, execFileName), distPath);
        if (platform !== 'win32') {
          fs.chmodSync(distPath, '755');
        }
        _.rimraf(tempDir);
        logger.info('chromedriver local in %s', distPath);
        resolve();
      })
      .on('error', function(err) {
        return reject(err);
      });
  });
};
