'use strict';

var errors = require('errors');
var logger = require('./logger').logger;

module.exports = errors;

errors.create({
	name: 'OurnetError',
	defaultMessage: 'Unknown error',
	code: 1000,
	logged: false
});

errors.OurnetError.prototype.log = function() {
	if (!this.logged) {
		logger.error(this.message, this);
	}
	this.logged = true;
	return this;
};

errors.create({
	name: 'OurnetValidationError',
	defaultMessage: 'Invalid data',
	parent: errors.OurnetError
});

errors.create({
	name: 'OurnetDataError',
	defaultMessage: 'Data error',
	parent: errors.OurnetError
});

errors.create({
	name: 'OurnetDbError',
	defaultMessage: 'Database error',
	parent: errors.OurnetError
});
