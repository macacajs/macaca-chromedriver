# macaca-chromedriver

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-chromedriver.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-chromedriver
[travis-image]: https://img.shields.io/travis/macacajs/macaca-chromedriver.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-chromedriver
[coveralls-image]: https://img.shields.io/coveralls/macacajs/macaca-chromedriver.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/macacajs/macaca-chromedriver?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_4-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-chromedriver.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-chromedriver

> Node.js wrapper for the selenium [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/).

## Installment

```shell
$ npm i macaca-chromedriver --save-dev
```

## Custom binaries url

To use a mirror of the ChromeDriver binaries use npm config property `chromedriver_cdnurl`.
Default is `http://chromedriver.storage.googleapis.com`.

```shell
npm install chromedriver --chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
```

Or add property into your [`.npmrc`](https://docs.npmjs.com/files/npmrc) file.

```
chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
```

Another option is to use PATH variable `CHROMEDRIVER_CDNURL`.

```shell
CHROMEDRIVER_CDNURL=http://npm.taobao.org/mirrors/chromedriver npm install chromedriver
```

## Quick Start

```shell
$ chromedriver
```

## License

The MIT License (MIT)

Copyright (c) 2015 xdf
