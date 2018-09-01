Node AniDB wrapper
==================


[![npm](https://img.shields.io/npm/dm/anidbjs.svg?style=flat-square)](https://www.npmjs.com/package/anidbjs)


This module provides a very minimal interface to fetch data from anidb.net. You may want to read the guidelines in the anidb [wiki](http://wiki.anidb.net/w/HTTP_API_Definition) first.

You need a registered client on AniDB to use this "lib".

Usage
-----
The module exports a constructor function which takes the clientid and the clientversion as its only two arguments.

``` javascript
const AniDB = require('anidb');
const client = new AniDB('someclientid', 'someclientversion');

client.getAnime(1).then(res => console.log(res)).catch(err => console.error(err))
```
