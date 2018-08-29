const $request = require('request')
const $querystring = require('querystring')
const $xml = require('xml2js')
const Mapper = require('./mapping')
const rateLimit = require('function-rate-limit')

const anidburl = 'http://api.anidb.net:9001/httpapi'
const anidbver = 1

function Db (client, version, msBetweenRequests = 0) {
  if (client === undefined || version === undefined) {
    throw new Error(
      'Insufficient arguments, new anidb(client, version, [msBetweenRequests])'
    )
  }
  this._client = client
  this._version = version
  this._mapper = new Mapper()
  this.msBetweenRequests = msBetweenRequests
}

Db.prototype._doRequest = function (options, callback) {
  return $request(options, callback)
}

Db.prototype.successfullResponse = function (response) {
  const errors = [
    '<error>Banned</error>',
    '<error>Client Values Missing or Invalid</error>'
  ]
  return errors.indexOf(response.body) === -1
}

Db.prototype.request = function (opts, cb) {
  const self = this
  opts.client = this._client
  opts.clientver = this._version
  opts.protover = anidbver

  const url = anidburl + '?' + $querystring.stringify(opts)

  rateLimit(
    1,
    self.msBetweenRequests,
    this._doRequest({ url: url, gzip: true }, function (error, response, body) {
      if (error) return cb(error, null)

      if (!self.successfullResponse(response)) {
        return cb(
          new Error(
            `Did not return a successfull response from anidb. Returned ${
              response.body
            }`
          ),
          null
        )
      }

      $xml.parseString(body, { explicitRoot: false, explicitArray: false }, cb)
    })
  )
}

Db.prototype.getAnime = function (id, cb) {
  const self = this

  const opts = {
    request: 'anime',
    aid: id
  }

  this.request(opts, function (err, response) {
    if (err) return cb(err)
    cb(null, self._mapper.mapAnime(response))
  })
}

Db.prototype.getGenres = function (cb) {
  const self = this

  const opts = {
    request: 'categorylist'
  }

  this.request(opts, function (err, response) {
    if (err) return cb(err)
    cb(null, self._mapper.mapGenres(response))
  })
}

module.exports = Db
