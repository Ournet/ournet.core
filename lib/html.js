'use strict';

var external = module.exports;

external.encode = function(html) {
	if (!html) {
		return html;
	}
	var entities = require('entities');

	return entities.encodeHTML(html);
};

external.decode = function(html) {
	if (!html) {
		return html;
	}
	var entities = require('entities');

	return entities.decodeHTML(html);
};

external.strip = function(html) {
	if (!html) {
		return html;
	}
	html = external.stripComments(html);
	return html.replace(/<\/?[^<>]*>/gi, '');
};

external.stripComments = function(html) {
	if (!html) {
		return html;
	}
	return html.replace(/<!--[\s\S]*?-->/g, '');
};
