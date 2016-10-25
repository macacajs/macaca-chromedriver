'use strict';

const utils = require('macaca-utils');
const childProcess = require('child_process');

const logger = require('./logger');

var _ = utils.merge({}, utils);

_.exec = function(cmd, opts) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, _.merge({
      maxBuffer: 1024 * 512 * 10,
      wrapArgs: false
    }, opts || {}), (err, stdout) => {
      if (err) {
        return reject(err);
      }
      resolve(_.trim(stdout));
    });
  });
};

_.sleep = function(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
};

_.retry = function(func, interval, num) {
  return new Promise((resolve, reject) => {
    func().then(resolve, err => {
      console.log(err.stack);
      if (num > 0 || typeof num === 'undefined') {
        _.sleep(interval).then(() => {
          resolve(_.retry(func, interval, num - 1));
        });
      } else {
        reject(err);
      }
    });
  });
};

_.spawn = function(/* command, args, options */) {
  var args = Array.prototype.slice.call(arguments);

  return new Promise((resolve, reject) => {
    var stdout = '';
    var stderr = '';
    var child = childProcess.spawn.apply(childProcess, args);

    child.on('error', error => {
      reject(error);
    });

    child.stdout.on('data', data => {
      stdout += data;
    });

    child.stderr.on('data', data => {
      stderr += data;
    });

    child.on('close', code => {
      var error;
      if (code) {
        error = new Error(stderr);
        error.code = code;
        return reject(error);
      }
      resolve([stdout, stderr]);
    });
  });
};

_.getPlatform = function() {
  var platform = process.platform;

  if (platform === 'linux') {
    if (process.arch === 'x64') {
      platform += '64';
    } else {
      platform += '32';
    }
  } else if (platform === 'darwin') {
    platform = 'mac32';
  } else if (platform !== 'win32') {
    logger.warn('Unexpected platform or architecture:', process.platform, process.arch);
    process.exit(1);
  }

  return platform;
};

module.exports = _;
