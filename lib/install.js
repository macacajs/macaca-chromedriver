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

_.sudoUserPermissionDenied();

function chromeOSXPaths(name) {
  return [
    process.env.HOME + '/Applications/' + name + '.app/Contents/MacOS/' + name,
    '/Applications/' + name + '.app/Contents/MacOS/' + name
  ];
}

function getOsMapChromeVsersion() {
  let tag = false;
  let versionNo = '';
  let shiftVersion = '';
  let version = '';
  let url = '';
  let CDNURL = 'http://chromedriver.storage.googleapis.com';
  let platform = process.platform;
  let chromedriverVersions = new Versions();
  if (platform === 'darwin') {
    tag = true;
    versionNo = child_process.spawnSync(chromeOSXPaths('Google\ Chrome')[1], ['--version']);
    shiftVersion = versionNo.output.toString().split(' ')[2].toString().split('.')[0];
    version = chromedriverVersions.getVersionFromWebviewVersion(parseInt(shiftVersion,10));
    url = util.format('%s/%s/chromedriver_%s.zip', CDNURL, version, _.getExecFile(version));
    logger.info('chromedriver  Automatically download url: %s', url);
  }
  return { url: url, tag: tag, version: version};
}

function getDownloadUrl(version) {
  let urlObject = getOsMapChromeVsersion();
  if (!urlObject.tag) {
    var CDNURL = process.env.CHROMEDRIVER_CDNURL || 'http://chromedriver.storage.googleapis.com';
    var url = util.format('%s/%s/chromedriver_%s.zip', CDNURL, version, _.getExecFile(version));
    logger.info('chromedriver cdn url: %s', url);
    return url;
  } else {
    return urlObject.url;
  }

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
  let chromedriverVersions = new Versions();
  let platform = process.platform;
  let execFileName = getExecZipedName();
  let urlObject = getOsMapChromeVsersion();
  let AutoVersion = urlObject.tag ? urlObject.version : undefined;

  let version = AutoVersion || process.env.CHROMEDRIVER_VERSION || cdVersion || chromedriverVersions.defaultVersion;
  logger.info('version: %s', version);
  let distPath = getBinPath(version);
  let url = getDownloadUrl(version);
  // chromedriver[.exe] file will be unziped to exec/${timestamp}/chromedriver[.exe] first
  // and then moved to exec/chromedriver2.xx[.exe]
  let tempDir = path.join(path.dirname(distPath), (new Date()).valueOf().toString());
  _.mkdir(path.dirname(distPath));
  _.mkdir(tempDir);

  return new Promise((resolve, reject) => {
    logger.info('Promise executing:' + url);
    request(url)
      .pipe(new UnZipStream(tempDir))
      .on('finish', function() {
        fs.renameSync(path.join(tempDir, execFileName), distPath);
        if (platform !== 'win32') {
          fs.chmodSync(distPath, '755');
        }
        _.rimraf(tempDir);
        logger.info('chromedriver local in %s', distPath, 'tempDir', tempDir);
        resolve();
      })
      .on('error', function(err) {
        return reject(err);
      });
  });
};
