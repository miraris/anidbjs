var $request = require('request');
var $querystring = require('querystring');
var $xml = require('xml2js');
var $_ = require('lodash');

var anidburl = 'http://api.anidb.net:9001/httpapi';
var anidbver = 1;

function Db(client, version) {
	this._client = client;
	this._version = version;
}

Db.prototype.successfullResponse = function(response){
	var successCodes = [200,201];
	return (successCodes.indexOf(response.statusCode) !== -1)
}

Db.prototype.request = function(opts, cb) {
	var self = this;
	opts.client = this._client;
	opts.clientver = this._version;
	opts.protover = anidbver;

	var url = anidburl + '?' + $querystring.stringify(opts);
	
	$request({url:url, gzip:true}, function (error, response, body){
		if(error) 
			return cb(error, null);
		
		if(!self.successfullResponse(response)) 
			return cb(new Error('Did not return a successfull response from anidb. Returned ' + response.statusCode), null)

		$xml.parseString(body, cb);

	});
}

Db.prototype.getAnime = function(id, cb) {
	var opts = {
		request: 'anime',
		aid: id
	};

	throw new Error('Not implemented yet..');
}

Db.prototype.getGenres = function(cb){
	var opts = {
		request: 'categorylist',
	};

	this.request(opts, function(err, response){
		if(err) return cb(err);

		var categories = response.categorylist.category.map(function(category){
			return {
				id: category.$.id,
				name: category.name[0],
				description: category.description ? category.description[0] : '',
				ishentai: category.$.ishentai,
				parentid: category.$.parentid
			};
		});

		cb(null, categories)

	});
}

module.exports = Db;