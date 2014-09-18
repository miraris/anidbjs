var $request = require('request'),
	$querystring = require('querystring'),
	$xml = require('xml2js'),
	$_ = require('lodash'),
	Mapper = require('./mapping'),
	rateLimit = require('function-rate-limit');

var anidburl = 'http://api.anidb.net:9001/httpapi';
var anidbver = 1;

function Db(client, version, msBetweenRequests) {
	this._client = client;
	this._version = version;
	this._mapper = new Mapper();
	this.msBetweenRequests = msBetweenRequests || 0;
}

Db.prototype.successfullResponse = function(response){
	var errors = ['<error>Banned</error>','<error>Client Values Missing or Invalid</error>'];
	return errors.indexOf(response.body) === -1;
}

Db.prototype.request = function(opts, cb) {
	var self = this;
	opts.client = this._client;
	opts.clientver = this._version;
	opts.protover = anidbver;

	var url = anidburl + '?' + $querystring.stringify(opts);
	
	rateLimit(1, self.msBetweenRequests, $request({url:url, gzip:true}, function (error, response, body){
		if(error) 
			return cb(error, null);
		
		if(!self.successfullResponse(response)) 
			return cb(new Error('Did not return a successfull response from anidb. Returned ' + response.body), null)

		$xml.parseString(body, { explicitRoot: false }, cb);

	}));
}

Db.prototype.getAnime = function(id, cb) {
	var self = this,
		opts = {
			request: 'anime',
			aid: id
		};

	this.request(opts, function(err, response){
		if(err) return cb(err);
		cb(null, self._mapper.mapAnime(response));
	});
}

Db.prototype.getGenres = function(cb){
	var self = this,
		opts = {
			request: 'categorylist',
		};

	this.request(opts, function(err, response){
		if(err) return cb(err);
		cb(null, self._mapper.mapGenres(response));

	});
}

module.exports = Db;