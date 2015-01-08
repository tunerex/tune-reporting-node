#!/usr/bin/env node
/**
 * SessionAuthenticate.js, TUNE Reporting SDK class.
 *
 * @module tune-reporting
 * @submodule api
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-07 15:32:40 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

// Dependencies
var
  InvalidArgument = require('../helpers').InvalidArgument,
  TuneSdkError = require('../helpers').TuneSdkError,
  TuneServiceError = require('../helpers').TuneServiceError,
  _ = require('lodash'),
  util = require('util'),
  prettyjson = require('prettyjson'),
  EndpointBase = require('../base/endpoints').EndpointBase;

/**
 * TUNE Advertiser Report endpoint '/export/'.
 *
 * @class SessionAuthenticate
 * @constructor
 * @extends EndpointBase
 */
function SessionAuthenticate() {
  SessionAuthenticate.super_.call(this, 'session/authenticate', false);
}

util.inherits(SessionAuthenticate, EndpointBase);

/**
 * Generate session token is returned to provide access to service.
 *
 * @method getSessionToken
 *
 * @param string apiKeys  Generate 'session token' for this api_keys.
 * @param object callback Error-first Callback.
 *
 * @return object
 * @throws InvalidArgument
 */
SessionAuthenticate.prototype.getSessionToken = function (
  apiKey,
  callback
) {
  if (!apiKey
      || !_.isString(apiKey)
      || (apiKey.length === 0)
      ) {
    throw new InvalidArgument('Parameter "apiKey" is not defined.');
  }

  var
    mapQueryString = {
      'api_keys': apiKey
    },
    endpointRequest = this.getEndpointRequest(
      'api_key',
      mapQueryString
    );

  // Success event response
  endpointRequest.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  endpointRequest.once('error', function onError(response) {
    callback(response, null);
  });
};

module.exports = SessionAuthenticate;