#!/usr/bin/env node
/**
 * Classes that define Tune Management API endpoints base functionality.
 *
 * @module base
 * @submodule endpoints
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
var
  InvalidArgument = require('../../helpers').InvalidArgument,
  _ = require('underscore'),
  util = require('util'),
  EndpointBase = require('./EndpointBase');

/**
 * Base class intended for handling Advertiser reports endpoints.
 *
 * @class ReportsEndpointBase
 * @extends EndpointBase
 * @constructor
 *
 * @param string controller                Tune Management API endpoint name.
 * @param string api_key                   MobileAppTracking API Key.
 * @param bool   filter_debug_mode         Remove debug mode information from
 *                                        results.
 * @param bool   filter_test_profile_id    Remove test profile information from
 *                                        results.
 * @param bool   validate_fields           Validate fields used by actions'
 *                                        parameters.
 */
function ReportsEndpointBase(
  controller,
  api_key,
  filter_debug_mode,
  filter_test_profile_id,
  validate_fields
) {
  this.filter_debug_mode = filter_debug_mode;
  this.filter_test_profile_id = filter_test_profile_id;

  ReportsEndpointBase.super_.call(
    this,
    controller,
    api_key,
    validate_fields
  );
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(ReportsEndpointBase, EndpointBase);

/**
 * Validate that response timezone is correct type.
 *
 * @method validateResponseTimezone
 * @protected
 *
 * @param string response_timezone
 *
 * @return {String}
 */
ReportsEndpointBase.prototype.validateResponseTimezone = function (response_timezone) {
  if (!_.isString(response_timezone) || (response_timezone.length === 0)) {
    throw new InvalidArgument('Parameter "response_timezone" is not valid.');
  }

  return response_timezone;
};

/**
 * Prepare action with provided query string parameters, then call
 * Management API service.
 *
 * @method requestRecords
 *
 * @param string    action            Endpoint action to be called.
 * @param dict      query_string_dict Query string parameters
 *                                  for this action.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 *
 * @throws InvalidArgument
 */
ReportsEndpointBase.prototype.requestRecords = function (
  action,
  query_string_dict
) {
  // action
  if (!action
      || !_.isString(action)
      || (action.length === 0)
      ) {
    throw new InvalidArgument('Parameter "action" is not defined.');
  }

  var sdk_filter = '';
  if (this.filter_debug_mode) {
    sdk_filter = '(debug_mode=0 OR debug_mode is NULL)';
  }
  if (this.filter_test_profile_id) {
    if (sdk_filter
        && _.isString(sdk_filter)
        && (0 < sdk_filter.length)
        ) {
      sdk_filter += ' AND ';
    }
    sdk_filter += '(test_profile_id=0 OR test_profile_id IS NULL)';
  }
  if (0 < sdk_filter.length) {
    if (query_string_dict.hasOwnProperty('filter')) {
      if (!query_string_dict.filter
          && _.isString(query_string_dict.filter)
          && (0 < query_string_dict.filter.length)
          ) {
        query_string_dict.filter =
          '(' + query_string_dict.filter + ') AND ' + sdk_filter;
      } else {
        query_string_dict.filter = sdk_filter;
      }
    } else {
      query_string_dict.filter = sdk_filter;
    }
  }
  if (query_string_dict.hasOwnProperty('filter')) {
    if (!query_string_dict.filter
        && _.isString(query_string_dict.filter)
        && (0 < query_string_dict.filter.length)
        ) {
      query_string_dict.filter = '(' + query_string_dict.filter + ')';
    }
  }

  return this.request(
    action,
    query_string_dict
  );
};

module.exports = ReportsEndpointBase;