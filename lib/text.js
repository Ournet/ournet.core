'use strict';

var external = module.exports;
var _ = require('lodash');

var ATONICS = {
	Ё: 'Е',
	ё: 'е',
	Й: 'И',
	й: 'и'
};
var OBJ_ROMANIAN_CORRECT = {
	'ș': /ş/g,
	'Ș': /Ş/g,
	'ț': /ţ/g,
	'Ț': /Ţ/g
};

function replaceAll(obj, text) {
	if (!text) {
		return text;
	}
	for (var prop in obj) {
		text = text.replace(obj[prop], prop);
	}
	return text;
}

external.endsWith = function(text, suffix) {
	return text.indexOf(suffix, text.length - suffix.length) !== -1;
};

external.startsWith = function(text, prefix) {
	return text.indexOf(prefix) === 0;
};

external.countUpperLetters = function(text) {
	if (!text || text.length === 0) {
		return 0;
	}
	var count = 0;
	for (var i = text.length - 1; i >= 0; i--) {
		if (external.isLetter(text[i]) && text[i] === text[i].toUpperCase()) {
			count++;
		}
	}

	return count;
};

external.countLetters = function(text) {
	if (!text || text.length === 0) {
		return 0;
	}
	var count = 0;
	for (var i = text.length - 1; i >= 0; i--) {
		if (external.isLetter(text[i])) {
			count++;
		}
	}

	return count;
};

external.isLetter = function(s) {
	return s.toUpperCase() !== s.toLowerCase();
};

external.normalize = function(text) {
	if (!text) {
		return text;
	}

	text = text.replace(/\r/g, '');
	text = text.replace(/\t/g, ' ');
	text = text.replace(/\n{2,}/g, '\n');
	text = text.replace(/\s+\n/g, '\n');
	text = text.replace(/\n\s+/g, '\n');
	text = text.replace(/\n{2,}/g, '\n');
	text = text.replace(/ {2,}/g, ' ');

	return text.trim();
};

external.wrapAt = function(text, length) {
	if (!text || text.length <= length) {
		return text;
	}

	return text.substr(0, length - 3) + '...';
};


external.removeDiacritics = function(text) {
	return require('diacritics').remove(text);
};

external.atonic = function(text) {
	if (!text) {
		return text;
	}

	text = external.removeDiacritics(text);

	return text.replace(/[^\u0000-\u007e]/g, function(c) {
		return ATONICS[c] || c;
	});
};

external.correct = function(text, lang) {
	if (!text) {
		return text;
	}
	if (lang === 'ro') {
		return replaceAll(OBJ_ROMANIAN_CORRECT, text);
	}
	return text;
};

external.splitKeywords = function(text, options) {
	if (!text) {
		return null;
	}
	var longs = [];
	var keywords = text.split(/[,;\|\t\r\n]|\.\s+/).map(function(item) {
		if (item && item[item.length - 1] === '.') {
			item = item.substr(0, item.length - 1);
		}
		return item.trim().toLowerCase();
	}).filter(function(item) {
		if (item.length > 30) {
			longs.push(item);
			return false;
		}
		return item && item.length > 1;
	});

	longs.forEach(function(word) {
		var words = word.split(/\s/gi).map(function(item) {
			item = item.trim().toLowerCase();
		}).filter(function(item) {
			return item && item.length > 1;
		});
		keywords = keywords.concat(words);
	});

	keywords = _.uniq(keywords);
	if (options && options.limit) {
		return _.take(keywords, options.limit);
	}
	return keywords;
};
