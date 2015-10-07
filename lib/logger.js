'use strict';

var winston = require('winston');

function initLoggly(options) {
  options = options || {};
  require('winston-loggly');
  var logger = options.logger || winston;
  logger.add(winston.transports.Loggly, {
    level: options.level || 'warn',
    subdomain: process.env.LOGGLY_DOMAIN,
    inputToken: process.env.LOGGLY_TOKEN,
    tags: options.tags,
    json: options.json
  });
}

module.exports = {
  createLogger: function(options) {
    return new winston.Logger(options);
  },
  logger: winston,
  init: initLoggly
};
