'use strict';

const nconf = require('nconf');
const moment = require('moment');
const request = require('request');
const logger = require('../logger');

let token = null;
let lastLogin = null;

module.exports = function(callback) {
  if (!token || !lastLogin || moment(new Date()).diff(lastLogin, 'minutes') > 60) {
    logger.info('Requesting access_token for Management API (v1).')

    var body = {
      'client_id':     nconf.get('auth0_global_client_id'),
      'client_secret': nconf.get('auth0_global_client_secret'),
      'grant_type':    'client_credentials'
    };

    var tokenUrl = `https://${nconf.get('auth0_domain')}/oauth/token`;
    logger.debug(' > Calling:', tokenUrl);

    request.post({ url:  tokenUrl, form: body }, function (err, resp, body) {
      if (err) return callback(err);
      if (resp.statusCode === 404) return callback(new Error('unknown client', 404));
      if (resp.statusCode.toString().substr(0, 1) !== '2') return callback(new Error(body, resp.statusCode));

      token = JSON.parse(body)['access_token'];
      lastLogin = moment();
      callback(null, token);
    });
  } else {
    callback(null, token);
  }
}
