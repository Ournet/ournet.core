'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var crypto = require('crypto');

/** global cache storage */
var storage = {};

function md5(value) {
	return crypto.createHash('md5').update(value).digest('hex');
}

/**
 *  @class MemoryCache
 *  options.name - global cache name
 *  options.ttl - instance default TTL
 **/
function MemoryCache(options) {
	EventEmitter.call(this);
	this.options = options || {};
	if (this.options.name) {
		this.storage = storage[this.options.name] || (storage[this.options.name] = {});
	} else {
		this.storage = {};
	}
}

util.inherits(MemoryCache, EventEmitter);

module.exports = MemoryCache;

MemoryCache.prototype.set = function(key, value, options) {
	var self = this;
	var ttl = options && options.ttl || typeof options === 'number' && options || this.options.ttl || 0;
	var item = this.getItem(key);

	ttl = ttl < 1 ? 0 : ttl;

	if (item && item.timeout) {
		clearTimeout(item.timeout);
		delete item.timeout;
		delete item.value;
	}
	item = {
		value: value
	};

	function onTimeout() {
		self.emit('timeout', key, item.value);
		self.remove(key);
	}
	if (ttl > 0) {
		item.timeout = setTimeout(onTimeout, ttl * 1000);
	}
	this.storage[key] = item;
};

MemoryCache.prototype.remove = function(key) {
	var item = this.getItem(key);
	if (!item) {
		return;
	}
	if (item.timeout) {
		clearTimeout(item.timeout);
		delete item.timeout;
	}
	delete item.value;
	delete this.storage[key];
};

MemoryCache.prototype.get = function(key) {
	var item = this.getItem(key);
	return item && item.value || undefined;
};

MemoryCache.prototype.formatKey = function(data) {
	return md5(JSON.stringify(data));
};

MemoryCache.prototype.getItem = function(key) {
	return this.storage[key];
};
