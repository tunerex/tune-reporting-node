#!/usr/bin/env node
/**
 * Classes that define TUNE Advertiser Report service access.
 *
 * @module tune-reporting
 * @submodule service
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-05 10:18:08 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

// Dependencies
var InvalidArgument = require('../../helpers').InvalidArgument,
  _ = require('underscore'),
  util = require('util'),
  Uri = require('jsuri'),
  QueryStringBuilder = require('./QueryStringBuilder');

/**
 * TuneManagementRequest provides the basic interface for all the
 * possible request types.
 *
 * @class TuneManagementRequest
 * @constructor
 *
 * @param string controller        TUNE Advertiser Report controller
 * @param string action            TUNE Advertiser Report controller's action
 * @param string apiKey           User's API Key provide by their
 *                                MobileAppTracking platform account.
 * @param dict   mapQueryString Query string elements appropriate
 *                                to the requested controller's action.
 *
 * @throws InvalidArgument
 */
function TuneManagementRequest(
  controller,
  action,
  apiKey,
  mapQueryString
) {
  this.controller = undefined;
  this.action = undefined;
  this.apiKey = undefined;
  this.mapQueryString = undefined;

  if (!controller
      || !_.isString(controller)
      || (controller.length === 0)
      ) {
    throw new InvalidArgument('Parameter "controller" is not defined.');
  }
  if (!action
      || !_.isString(action)
      || (action.length === 0)
      ) {
    throw new InvalidArgument('Parameter "action" is not defined.');
  }
  if (!apiKey
      || !_.isString(apiKey)
      || (apiKey.length === 0)
      ) {
    throw new InvalidArgument('Parameter "apiKey" is not defined.');
  }
  if (mapQueryString
      && !_.isObject(mapQueryString)
      ) {
    throw new InvalidArgument('Parameter "mapQueryString" is not defined.');
  }

  this.controller = controller;
  this.action = action;
  this.apiKey = apiKey;
  this.mapQueryString = mapQueryString;
}

/**
 * TUNE Advertiser Report SDK name
 *
 * @property SDK_NAME
 *
 * @type string
 * @static
 * @final
  */
TuneManagementRequest.SDK_NAME = 'tune-reporting-node';

/**
 * TUNE Advertiser Report SDK version
 *
 * @property SDK_VERSION
 *
 * @type string
 * @static
 * @final
  */
TuneManagementRequest.SDK_VERSION = '0.1.17';

/**
 * TUNE Advertiser Report base URL
 *
 * @property API_URL_BASE
 *
 * @type string
 * @static
 * @final
  */
TuneManagementRequest.API_URL_BASE = 'api.mobileapptracking.com';

/**
 * TUNE Advertiser Report base URL version
 *
 * @property API_URL_VERSION
 *
 * @type string
 * @static
 * @final
  */
TuneManagementRequest.API_URL_VERSION = 'v2';

/**
 * Get controller property for this request.
 *
 * @property getController
 * @return {String}
 */
TuneManagementRequest.prototype.getController = function () {
  return this.controller;
};

/**
 * Get controller action property for this request.
 *
 * @property getAction
 * @return {String}
 */
TuneManagementRequest.prototype.getAction = function () {
  return this.action;
};

/**
 * Get apiKey property
 *
 * @property getApiKey
 * @return {String}
 */
TuneManagementRequest.prototype.getApiKey = function () {
  return this.apiKey;
};

/**
 * Get mapQueryString property
 *
 * @property getQueryData
 * @return {Dictionary}
 */
TuneManagementRequest.prototype.getQueryData = function () {
  return this.mapQueryString;
};

/**
 * Create query string using provide values in set properties of this request object.
 *
 * @method getQueryStringBuilder
 * @return {Dictionary}
 */
TuneManagementRequest.prototype.getQueryStringBuilder = function () {
  var qsb = new QueryStringBuilder(),
    name;

  qsb.add('sdk', this.SDK_NAME);
  qsb.add('ver', this.SDK_VERSION);

  // Every request should contain an API Key
  qsb.add('api_key', this.apiKey);

  // Internal Debug
  // qsb.add('debug', 10);

  // Build query string with provided contents in dictionary
  if (this.mapQueryString) {
    for (name in this.mapQueryString) {
      if (this.mapQueryString.hasOwnProperty(name)) {
        qsb.add(name, this.mapQueryString[name]);
      }
    }
  }

  return qsb;
};

/**
 * Get query string dictionary
 *
 * @method getQueryStringMap
 * @return {Dictionary}
 */
TuneManagementRequest.prototype.getQueryStringMap = function () {
  return this.getQueryStringBuilder().getQueryStringMap();
};

/**
 * Get query string
 *
 * @method getQueryString
 * @return {String}
 */
TuneManagementRequest.prototype.getQueryString = function () {
  return this.getQueryStringBuilder().toString();
};

/**
 * TUNE Advertiser Report service path
 *
 * @method getPath
 * @return {String}
 */
TuneManagementRequest.prototype.getPath = function () {
  var request_path = new Uri()
    .setProtocol('https')
    .setHost(TuneManagementRequest.API_URL_BASE)
    .setPath(
      util.format(
        '/%s/%s/%s.json',
        TuneManagementRequest.API_URL_VERSION,
        this.controller,
        this.action
      )
    );

  return request_path;
};

/**
 * TUNE Advertiser Report full service request
 *
 * @method getUrl
 * @return {String}
 */
TuneManagementRequest.prototype.getUrl = function () {
  var requestUrl = util.format('%s?%s', this.getPath(), this.getQueryString());
  return requestUrl;
};

module.exports = TuneManagementRequest;
