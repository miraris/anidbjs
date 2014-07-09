Node AniDB Queries
==================

This module provides a very minimal interface to fetch data from anidb.net. You may want to read the guidelines in the anidb [wiki](http://wiki.anidb.net/w/HTTP_API_Definition) first.

You will see, that you need a client id and version number (instructions in the wiki) which can be supplied to the main Connection object.

Usage
-----
The module exports a constructor function which takes the clientid and the clientversion as its only two arguments.

``` javascript
var Anidb = require('anidb');
var db = new Anidb('someclientid', 'someclientversion');
```

### Anidb.request(options, cb)
Sends a basic request to anidb.net with your client information and any supplied data. Any properties on the options object will be sent as part of the querystring and the callback is called as soon as the entire response is available.
The response will be an xml string.

### Anidb.getAnime(id, cb)
Uses `Anidb.request()` to fetch a single anime's data. The callback is called after the server response is run through [xml2js](https://www.npmjs.org/package/xml2js).
