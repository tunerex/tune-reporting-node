#!/usr/bin/env node
/**
 * Classes that define TUNE Advertiser Report endpoints base functionality.
 *
 * @module tune-reporting
 * @submodule endpoints
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-07 18:08:35 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

// Dependencies
var
  InvalidArgument = require('../../helpers').InvalidArgument,
  _ = require('lodash'),
  util = require('util'),
  EndpointBase = require('./EndpointBase');

/**
 * Base class intended for handling Advertiser reports endpoints.
 *
 * @class AdvertiserReportBase
 * @extends EndpointBase
 * @constructor
 *
 * @param string controller           TUNE Advertiser Report endpoint name.
 * @param bool   filterDebugMode      Remove debug mode information from
 *                                    results.
 * @param bool   filterTestProfileId  Remove test profile information from
 *                                    results.
 */
function AdvertiserReportBase(
  controller,
  filterDebugMode,
  filterTestProfileId
) {
  this.filterDebugMode = filterDebugMode;
  this.filterTestProfileId = filterTestProfileId;

  AdvertiserReportBase.super_.call(
    this,
    controller,
    true
  );
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(AdvertiserReportBase, EndpointBase);

/**
 * Validate that response timezone is correct type.
 *
 * @method validateResponseTimezone
 * @protected
 *
 * @param string strResponseTimezone
 *
 * @return {String}
 */
AdvertiserReportBase.prototype.validateResponseTimezone = function (strResponseTimezone) {
  if (!_.isString(strResponseTimezone) || (strResponseTimezone.length === 0)) {
    throw new InvalidArgument('Parameter "strResponseTimezone" is not valid.');
  }

  return strResponseTimezone;
};

/**
 * Prepare action with provided query string parameters, then call
 * Management API service.
 *
 * @method getReportRequest
 *
 * @param string    action            Endpoint action to be called.
 * @param dict      mapQueryString Query string parameters
 *                                  for this action.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 *
 * @throws InvalidArgument
 */
AdvertiserReportBase.prototype.getReportRequest = function (
  action,
  mapQueryString
) {

  // action
  if (!action
      || !_.isString(action)
      || (action.length === 0)
      ) {
    throw new InvalidArgument('Parameter "action" is not defined.');
  }

  var
    sdk_filter = '',
    endpointRequest;

  if (this.filterDebugMode) {
    sdk_filter = '(debug_mode=0 OR debug_mode is NULL)';
  }
  if (this.filterTestProfileId) {
    if (sdk_filter
        && _.isString(sdk_filter)
        && (0 < sdk_filter.length)
        ) {
      sdk_filter += ' AND ';
    }
    sdk_filter += '(test_profile_id=0 OR test_profile_id IS NULL)';
  }
  if (0 < sdk_filter.length) {
    if (mapQueryString.hasOwnProperty('filter')) {
      if (mapQueryString.filter
          && _.isString(mapQueryString.filter)
          && (0 < mapQueryString.filter.length)
          ) {
        mapQueryString.filter =
          '(' + mapQueryString.filter + ') AND ' + sdk_filter;
      } else {
        mapQueryString.filter = sdk_filter;
      }
    } else {
      mapQueryString.filter = sdk_filter;
    }
  }
  if (mapQueryString.hasOwnProperty('filter')) {
    if (mapQueryString.filter
        && _.isString(mapQueryString.filter)
        && (0 < mapQueryString.filter.length)
        ) {
      mapQueryString.filter = '(' + mapQueryString.filter + ')';
    }
  }

  endpointRequest = this.getEndpointRequest(
    action,
    mapQueryString
  );

  return endpointRequest;
};

module.exports = AdvertiserReportBase;