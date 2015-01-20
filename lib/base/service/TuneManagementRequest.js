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
 * @version   $Date: 2015-01-13 16:19:00 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

// Dependencies
var
  _ = require('lodash'),
  util = require('util'),
  Uri = require('jsuri'),
  InvalidArgument = require('../../helpers').InvalidArgument,
  TuneManagementQueryString = require('./TuneManagementQueryString');

/**
 * TuneManagementRequest provides the basic interface for all the
 * possible request types.
 *
 * @class TuneManagementRequest
 * @constructor
 *
 * @param string controller     TUNE Advertiser Report controller
 * @param string action         TUNE Advertiser Report controller's action
 * @param string authKey        TUNE Authentication Key.
 * @param string authType       TUNE Authentication Type.
 * @param dict   mapQueryString Query string elements appropriate
 *                                to the requested controller's action.
 *
 * @throws InvalidArgument
 */
function TuneManagementRequest(
  controller,
  action,
  authKey,
  authType,
  mapQueryString
) {
  this.controller = undefined;
  this.action = undefined;
  this.authKey = undefined;
  this.authType = undefined;
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
  if (mapQueryString
      && !_.isObject(mapQueryString)
      ) {
    throw new InvalidArgument('Parameter "mapQueryString" is not defined.');
  }

  this.controller = controller;
  this.action = action;
  this.authKey = authKey;
  this.authType = authType;
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
TuneManagementRequest.SDK_VERSION = '0.9.1';

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
 * Get authKey property
 *
 * @method getAuthKey
 *
 * @return {String}
 */
TuneManagementRequest.prototype.getAuthKey = function () {
  return this.authKey;
};

/**
 * Get authType property
 *
 * @method getAuthType
 *
 * @return {String}
 */
TuneManagementRequest.prototype.getAuthType = function () {
  return this.authType;
};

/**
 * Get mapQueryString property
 *
 * @method getQueryData
 *
 * @return {Dictionary}
 */
TuneManagementRequest.prototype.getQueryData = function () {
  return this.mapQueryString;
};

/**
 * Create query string using provide values in set properties of this request object.
 *
 * @method getTuneManagementQueryString
 *
 * @return {Dictionary}
 */
TuneManagementRequest.prototype.getTuneManagementQueryString = function () {
  var tuneQueryString = new TuneManagementQueryString(),
    name;

  tuneQueryString.add('sdk', TuneManagementRequest.SDK_NAME);
  tuneQueryString.add('ver', TuneManagementRequest.SDK_VERSION);

  if (!_.isEmpty(this.mapQueryString.session_token)
      && !_.isEmpty(this.mapQueryString.api_key)) {
    delete this.mapQueryString.api_key;
  } else if (_.isEmpty(this.mapQueryString.session_token)
             && _.isEmpty(this.mapQueryString.api_key)) {
    if (this.authKey && this.authType) {
      tuneQueryString.add(this.authType, this.authKey);
    }
  }

  // Build query string with provided contents in dictionary
  if (this.mapQueryString) {
    for (name in this.mapQueryString) {
      if (this.mapQueryString.hasOwnProperty(name)) {
        tuneQueryString.add(name, this.mapQueryString[name]);
      }
    }
  }

  return tuneQueryString;
};

/**
 * Get query string dictionary
 *
 * @method getQueryStringMap
 *
 * @return {Dictionary}
 */
TuneManagementRequest.prototype.getQueryStringMap = function () {
  return this.getTuneManagementQueryString().getQueryStringMap();
};

/**
 * Get query string
 *
 * @method getQueryString
 *
 * @return {String}
 */
TuneManagementRequest.prototype.getQueryString = function () {
  return this.getTuneManagementQueryString().stringify();
};

/**
 * TUNE Advertiser Report service path
 *
 * @method getUrl
 *
 * @return {String}
 */
TuneManagementRequest.prototype.getUrl = function () {
  var uriFullPath = new Uri()
    .setProtocol('https')
    .setHost(TuneManagementRequest.API_URL_BASE)
    .setPath(
      this.getPath()
    );

  return String(uriFullPath);
};


/**
 * TUNE Advertiser Report service path
 *
 * @method getPath
 *
 * @return {String}
 */
TuneManagementRequest.prototype.getPath = function () {
  var
    path =
      util.format(
        '/%s/%s/%s.json',
        TuneManagementRequest.API_URL_VERSION,
        this.controller,
        this.action
      ),
    querystring = this.getQueryString();

  if (querystring && 0 < querystring.length) {
    path = util.format('%s?%s', path, querystring);
  }

  return path;
};


module.exports = TuneManagementRequest;
