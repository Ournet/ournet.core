'use strict';

var Promise = require('bluebird');
var Logger = require('./lib/logger');
var time = require('time');


module.exports = {
	util: require('./lib/util'),
	html: require('./lib/html'),
	text: require('./lib/text'),
	dynamo: require('./lib/dynamo'),

	_: require('lodash'),
	Promise: Promise,

	MemoryCache: require('./lib/MemoryCache'),
	fs: Promise.promisifyAll(require('fs-extra')),

	//logger
	Logger: Logger,
	logger: Logger.logger,

	errors: require('./lib/errors.js'),

	constants: require('./lib/constants.js'),

	crypto: require('./lib/crypto.js'),

	date: function(milliseconds, timezone) {
		if (typeof milliseconds === 'string') {
			timezone = milliseconds;
			milliseconds = undefined;
		}
		var date;

		date = milliseconds ? new time.Date(milliseconds) : new time.Date();

		if (timezone) {
			date.setTimezone(timezone);
		}

		return date;
	}
};
