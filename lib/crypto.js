'use strict';

var crypto = require('crypto');
var ALG = 'des';

function encrypt(text) {
  //console.log(crypto.getCiphers());
  var cipher = crypto.createCipher(ALG, process.env.SCRYPTO_PASS);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(ALG, process.env.SCRYPTO_PASS);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

exports.decrypt = decrypt;
exports.encrypt = encrypt;
