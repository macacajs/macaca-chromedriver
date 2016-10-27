'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const stream = require('stream');
const AdmZip = require('adm-zip');
const request = require('request');

const _ = require('./helper');
const logger = require('./logger');
const Chromedriver = require('./macaca-chromedriver');

const CDNURL = process.env.CHROMEDRIVER_CDNURL || 'http://chromedriver.storage.googleapis.com';

function getDownloadUrl() {
  var url = util.format('%s/%s/chromedriver_%s.zip', CDNURL, Chromedriver.version, _.getExecFile(Chromedriver.version));
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
  zip.extractAllTo(path.join(this.distPath, '..'));
  callback();
};

module.exports = function() {
  var platform = process.platform;
  var url = getDownloadUrl();
  var distPath = Chromedriver.binPath;
  _.mkdir(path.dirname(distPath));

  return new Promise(function(resolve, reject) {
    request(url)
      .pipe(new UnZipStream(distPath))
      .on('finish', function() {
        logger.info('chromedriver local in %s', distPath);

        if (platform !== 'win32') {
          fs.chmodSync(distPath, '755');
        }
        resolve();
      })
      .on('error', function(err) {
        return reject(err);
      });
  });
};
