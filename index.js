var $http = require('http');
var $querystring = require('querystring');
var $bops = require('bops');
var $zlib = require('zlib');
var $xml = require('xml2js');
var $async = require('async');

var anidburl = 'http://api.anidb.net:9001/httpapi';
var anidbver = 1;

function Db(client, version) {
	this._client = client;
	this._version = version;
}

Db.prototype.request = function(opts, cb) {
	var buffer = [];
	var gunzip = $zlib.createGunzip();
	gunzip.on('data', function(data) {
		buffer.push(data);
	});
	gunzip.on('end', function() {
		cb(null, $bops.join(buffer).toString());
	});


	opts.client = this._client;
	opts.clientver = this._version;
	opts.protover = anidbver;

	var url = anidburl+'?'+$querystring.stringify(opts);
	$http.get(url, function(res) {
		res.on('error', cb);

		console.log(res.headers);

		res.pipe(gunzip);
	}).on('error', cb);
}

Db.prototype.getAnime = function(id, cb) {
	var opts = {
		request: 'anime',
		aid: id
	}

	$async.waterfall([
		this.request.bind(this, opts),
		$xml.parseString
	], cb);
}

module.exports = Db;