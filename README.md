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
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/macaca-chromedriver.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-chromedriver

> Node.js wrapper for the selenium [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/).

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars1.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars1.githubusercontent.com/u/1044425?v=4" width="100px;"/><br/><sub><b>ziczhu</b></sub>](https://github.com/ziczhu)<br/>|[<img src="https://avatars3.githubusercontent.com/u/1209810?v=4" width="100px;"/><br/><sub><b>paradite</b></sub>](https://github.com/paradite)<br/>|[<img src="https://avatars2.githubusercontent.com/u/5734727?v=4" width="100px;"/><br/><sub><b>Yinxl</b></sub>](https://github.com/Yinxl)<br/>|[<img src="https://avatars0.githubusercontent.com/u/6824951?v=4" width="100px;"/><br/><sub><b>kyowang</b></sub>](https://github.com/kyowang)<br/>|[<img src="https://avatars1.githubusercontent.com/u/17233599?v=4" width="100px;"/><br/><sub><b>Chan-Chun</b></sub>](https://github.com/Chan-Chun)<br/>
| :---: | :---: | :---: | :---: | :---: | :---: |
|[<img src="https://avatars3.githubusercontent.com/u/29550321?v=4" width="100px;"/><br/><sub><b>Super-Ps</b></sub>](https://github.com/Super-Ps)<br/>|[<img src="https://avatars2.githubusercontent.com/u/12215513?v=4" width="100px;"/><br/><sub><b>zjhch123</b></sub>](https://github.com/zjhch123)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Tue Aug 13 2019 09:45:24 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## Installment

```bash
$ npm i macaca-chromedriver --save-dev
```

## Custom port

Another option is to use port variable `MACACA_CHROMEDRIVER_PORT`

```bash
$ MACACA_CHROMEDRIVER_PORT=9516 macaca run --verbose
```

## Custom binaries url

To use a mirror of the ChromeDriver binaries use npm config property `chromedriver_cdnurl`.
Default is `http://chromedriver.storage.googleapis.com`.

```bash
$ npm install chromedriver --chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
```

Or add property into your [`.npmrc`](https://docs.npmjs.com/files/npmrc) file.

```bash
$ chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
```

Another option is to use PATH variable `CHROMEDRIVER_CDNURL`.

```bash
$ CHROMEDRIVER_CDNURL=http://npm.taobao.org/mirrors/chromedriver npm install chromedriver
```

## Quick Start

```bash
$ chromedriver
```

## Custom Version

```bash
$ CHROMEDRIVER_VERSION=2.2x npm i macaca-chromedriver -g
```
versioning list: https://chromedriver.chromium.org/downloads

## License

The MIT License (MIT)
