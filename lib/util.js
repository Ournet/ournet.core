'use strict';

var crypto = require('crypto');
var uuid = require('uuid');
var _ = require('lodash');

var RANDOM_POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var EMPTY_STRING = '';

function buildName(name, options) {
	var ns = name.split(options.separator || '.'),
		o = options.container,
		val = options.val,
		i, len;
	for (i = 0, len = ns.length; i < len; i++) {
		var v = (i === len - 1 && val) ? val : {};
		o = o[ns[i]] = o[ns[i]] || v;
	}
	return o;
}

//http://stackoverflow.com/a/8817473/828615
function deepValue(obj, path) {
	path = path.split('.');
	for (var i = 0, len = path.length; i < len; i++) {
		obj = obj[path[i]];
	}
	return obj;
}

// function reval(str, obj) {
// 	var str = str.split('.');
// 	for (var z = 0; z < str.length; z++) {
// 		obj = obj[str[z]];
// 	}
// 	return obj;
// }

function randomString(l) {
	l = l || 32;
	var text = EMPTY_STRING;
	var possible = RANDOM_POSSIBLE;

	for (var i = 0; i < l; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}


function md5(value) {
	return crypto.createHash('md5').update(value).digest('hex');
}

function sha1(value) {
	return crypto.createHash('sha1').update(value).digest('hex');
}

// function isMd5Hash(value) {
// 	return !isNullOrEmpty(value) && _.isString(value) && value.length === 32 && /[a-zA-Z0-9]{32}/.test(value);
// }

function isNull(value) {
	return [undefined, null].indexOf(value) > -1;
}

function isNotNull(value) {
	return !isNull(value);
}

function isNullOrEmpty(value) {
	var result = [undefined, null, ''].indexOf(value) > -1;
	if (result) {
		return result;
	}
	if (Array.isArray(value)) {
		return value.length === 0;
	}

	if (value.trim) {
		return value.trim().length === 0;
	}
	return result;
}

var INT_REGEX = /^\d+$/;

function isStringInt(str) {
	return INT_REGEX.test(str);
}

function intOrDefault(str) {
	if (isStringInt(str)) {
		return parseInt(str);
	}
	return str;
}

var OBJ_ROMANIAN_CORRECT = {
	'ș': /ş/g,
	'Ș': /Ş/g,
	'ț': /ţ/g,
	'Ț': /Ţ/g
};

var OBJ_ROMANIAN_ATONIC = {
	's': /[şș]/g,
	'S': /[ŞȘ]/g,
	't': /[ţț]/g,
	'T': /[ȚŢ]/g,
	'I': /Î/g,
	'A': /[ĂÂ]/g,
	'i': /î/g,
	'a': /[ăâ]/g
};

var OBJ_ALBANIAN_ATONIC = {
	'e': /ë/g
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

function romanianCorrect(text) {
	return replaceAll(OBJ_ROMANIAN_CORRECT, text);
}

function romanianAtonic(text) {
	return replaceAll(OBJ_ROMANIAN_ATONIC, text);
}

function albanianAtonic(text) {
	return replaceAll(OBJ_ALBANIAN_ATONIC, text);
}

function formatDate(date, separator) {
	separator = _.isString(separator) ? separator : '-';
	return date.getFullYear() + separator + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + separator + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
}

function startWithUpperCase(str) {
	if (!str || str.length < 1) {
		return str;
	}
	return str[0].toUpperCase() + str.substr(1);
}

function endsWith(target, end) {
	if (!target || !end || target.length < end.length) {
		return false;
	}

	return target.substr(target.length - end.length) === end;
}

var NUMBER_SEPARATORS = {
	point_comma: ['.', ','],
	comma_point: [',', '.'],
	space_comma: [' ', ',']
};

var LANG_NUMBER_SEPARATORS = {
	ro: 'point_comma',
	ru: 'space_comma',
	en: 'comma_point'
};

function getNumberSeparators(language) {
	return NUMBER_SEPARATORS[LANG_NUMBER_SEPARATORS[language] || LANG_NUMBER_SEPARATORS.en];
}

function numberFormatInternal(number, decimals, thousandsSep, decPoint) {
	decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
	decPoint = (decPoint === undefined) ? '.' : decPoint;
	thousandsSep = (thousandsSep === undefined) ? ',' : thousandsSep;

	var sign = number < 0 ? '-' : '';
	number = Math.abs(+number || 0);

	var intPart = parseInt(number.toFixed(decimals), 10) + '';
	var j = intPart.length > 3 ? intPart.length % 3 : 0;

	return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
}

function numberFormat(number, decimals, language) {
	if (_.isString(decimals)) {
		language = decimals;
		decimals = undefined;
	}
	language = language || 'en';
	var separators = getNumberSeparators(language);
	return numberFormatInternal(number, decimals, separators[0], separators[1]);
}

function removeDiacritics(text) {
	return require('diacritics').remove(text);
}

var ATONICS = {
	Ё: 'Е',
	ё: 'е',
	Й: 'И',
	й: 'и'
};

function atonic(text) {
	if (!text) {
		return text;
	}

	text = removeDiacritics(text);

	return text.replace(/[^\u0000-\u007e]/g, function(c) {
		return ATONICS[c] || c;
	});
}

function clearObject(obj) {
	if (!obj) {
		return obj;
	}
	for (var prop in obj) {
		if ([null, undefined].indexOf(obj[prop]) > -1) {
			delete obj[prop];
		}
	}
	return obj;
}

module.exports = {
	clearObject: clearObject,
	atonic: atonic,
	removeDiacritics: removeDiacritics,
	randomString: randomString,
	buildName: buildName,
	deepValue: deepValue,
	md5: md5,
	isNullOrEmpty: isNullOrEmpty,
	isNull: isNull,
	isNotNull: isNotNull,
	now: Date.now,
	uuid: uuid.v4,
	sha1: sha1,
	isStringInt: isStringInt,
	intOrDefault: intOrDefault,
	romanianCorrect: romanianCorrect,
	romanianAtonic: romanianAtonic,
	albanianAtonic: albanianAtonic,
	formatDate: formatDate,
	startWithUpperCase: startWithUpperCase,
	endsWith: endsWith,
	numberFormat: numberFormat
};
