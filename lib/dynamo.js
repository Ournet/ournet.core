'use strict';

var _ = require('lodash');

function get(data) {
	if (_.isNull(data) || _.isUndefined(data)) {
		return data;
	}
	if (_.isArray(data)) {
		return data.map(get);
	}
	if (_.isArray(data.Items)) {
		return get(data.Items);
	}
	if (_.isFunction(data.toJSON)) {
		return data.toJSON();
	}
	if (_.isObject(data)) {
		Object.keys(data).forEach(function(key) {
			data[key] = get(data[key]);
		});
	}
	return data;
}

exports.get = get;
