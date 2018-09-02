# Node AniDB wrapper

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

> A minimalistic AniDB HTTP API wrapper for Node.js.

This module provides a very minimal interface to fetch data from anidb.net. You may want to read the guidelines in the anidb [wiki](http://wiki.anidb.net/w/HTTP_API_Definition) first.

You need a client registered on AniDB to use this "lib".

## Usage

The module exports a constructor function which takes the 2 objects - `credentials` and `options` as its only two arguments.

```javascript
const AniDb = require("anidb");
const client = new AniDb({ client: "myclient", version: 1 });

client
  .randomRecommendation()
  .then(res => console.log(res))
  .catch(err => console.error(err));

client
  .anime(1)
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

[package-url]: https://npmjs.org/package/anidbjs
[travis-svg]: https://travis-ci.org/miraris/anidbjs.svg
[travis-url]: https://travis-ci.org/miraris/anidbjs
[deps-svg]: https://david-dm.org/miraris/anidbjs.svg
[deps-url]: https://david-dm.org/miraris/anidbjs
[dev-deps-svg]: https://david-dm.org/miraris/anidbjs/dev-status.svg
[dev-deps-url]: https://david-dm.org/miraris/anidbjs#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/anidbjs.png
[license-image]: http://img.shields.io/npm/l/anidbjs.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/anidbjs.svg
[downloads-url]: http://npm-stat.com/charts.html?package=anidbjs