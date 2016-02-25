/* ================================================================
 * macaca-chromedriver by xdf(xudafeng[at]126.com)
 *
 * first created at : Fri Sep 11 2015 00:49:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var _ = require('./helper');
var JSZip = require('jszip');
var stream = require('stream');
var request = require('request');
var logger = require('./logger');
var Chromedriver = require('./macaca-chromedriver');

var CDNURL = process.env.CHROMEDRIVER_CDNURL || 'http://chromedriver.storage.googleapis.com';

function getDownloadUrl(platform) {
  var url = util.format('%s/%s/chromedriver_%s.zip', CDNURL, Chromedriver.version, platform);
  logger.info('chromedriver cdn url: %s', url);
  return url;
}

function UnZipStream(options) {
  stream.Transform.call(this, options);
  this.file = options.file;
  this.data = [];
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

  var zip = new JSZip(buf);
  var files = zip.files;
  var fileObj = files[this.file];
  var content = fileObj.asNodeBuffer();
  this.push(content);
  callback();
};

module.exports = function() {
  var platform = _.getPlatform();
  var url = getDownloadUrl(platform);
  var distPath = Chromedriver.binPath;
  _.mkdir(path.dirname(distPath));

  return new Promise(function(resolve, reject) {
    request(url)
      .pipe(new UnZipStream({
        file: Chromedriver.fileName
      }))
      .pipe(fs.createWriteStream(distPath))
      .on('finish', function() {
        logger.info('chromedriver local in %s', distPath);

        if (platform !== 'win32') {
          var stat = fs.statSync(distPath);

          if (!(stat.mode & 64)) {
            logger.info('Fixed file permissions');
            fs.chmodSync(distPath, '755');
          }
        }
        resolve();
      })
      .on('error', function(err) {
        return reject(err);
      });
  });
};
