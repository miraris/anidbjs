# Node AniDB wrapper

[![npm](https://img.shields.io/npm/dm/anidbjs.svg?style=flat-square)](https://www.npmjs.com/package/anidbjs)

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
