#!/usr/bin/env node
/**
 * Classes that define Tune Management API service access.
 *
 * @module base
 * @submodule service
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 Tune (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-10 07:44:51 $
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
 * @param string controller        Tune Management API controller
 * @param string action            Tune Management API controller's action
 * @param string api_key           User's API Key provide by their
 *                                MobileAppTracking platform account.
 * @param dict   query_string_dict Query string elements appropriate
 *                                to the requested controller's action.
 *
 * @throws InvalidArgument
 */
function TuneManagementRequest(
  controller,
  action,
  api_key,
  query_string_dict
) {
  this.controller = undefined;
  this.action = undefined;
  this.api_key = undefined;
  this.query_string_dict = undefined;

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
  if (!api_key
      || !_.isString(api_key)
      || (api_key.length === 0)
      ) {
    throw new InvalidArgument('Parameter "api_key" is not defined.');
  }
  if (query_string_dict
      && !_.isObject(query_string_dict)
      ) {
    throw new InvalidArgument('Parameter "query_string_dict" is not defined.');
  }

  this.controller = controller;
  this.action = action;
  this.api_key = api_key;
  this.query_string_dict = query_string_dict;
}

/**
 * Tune Mangement API base URL
 *
 * @property API_URL_BASE
 *
 * @type string
 * @static
 * @final
  */
TuneManagementRequest.API_URL_BASE = 'api.mobileapptracking.com';

/**
 * Tune Mangement API base URL version
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
 * Get api_key property
 *
 * @property getApiKey
 * @return {String}
 */
TuneManagementRequest.prototype.getApiKey = function () {
  return this.api_key;
};

/**
 * Get query_string_dict property
 *
 * @property getQueryData
 * @return {Dictionary}
 */
TuneManagementRequest.prototype.getQueryData = function () {
  return this.query_string_dict;
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

  // Every request should contain an API Key
  qsb.add('api_key', this.api_key);

  // Build query string with provided contents in dictionary
  if (this.query_string_dict) {
    for (name in this.query_string_dict) {
      if (this.query_string_dict.hasOwnProperty(name)) {
        qsb.add(name, this.query_string_dict[name]);
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
 * Tune Management API service path
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
 * Tune Management API full service request
 *
 * @method getUrl
 * @return {String}
 */
TuneManagementRequest.prototype.getUrl = function () {
  var request_url = util.format('%s?%s', this.getPath(), this.getQueryString());
  return request_url;
};

module.exports = TuneManagementRequest;