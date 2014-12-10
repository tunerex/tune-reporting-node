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
  ReportsEndpointBase = require('./ReportsEndpointBase');

/**
 * Base class intended for gathering from Advertiser Stats actuals.
 * @uses Stats
 * @uses Actuals
 *
 * @class ReportsActualsEndpointBase
 * @extends ReportsEndpointBase
 * @constructor
 *
 * @param string controller                Tune Management API endpoint name.
 * @param string api_key                   Tune MobileAppTracking API Key.
 * @param bool   filter_debug_mode         Remove debug mode information
 *                                        from results.
 * @param bool   filter_test_profile_id    Remove test profile information
 *                                        from results.
 * @param bool   validate_fields           Validate fields used by actions'
 *                                        parameters.
 */
function ReportsActualsEndpointBase(
  controller,
  api_key,
  filter_debug_mode,
  filter_test_profile_id,
  validate_fields
) {
  ReportsActualsEndpointBase.super_.call(
    this,
    controller,
    api_key,
    filter_debug_mode,
    filter_test_profile_id,
    validate_fields
  );
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(ReportsActualsEndpointBase, ReportsEndpointBase);

/**
 * Available values for parameter 'timestamp'.
 *
 * @property TIMESTAMPS
 *
 * @type array
 * @static
 * @final
 */
ReportsActualsEndpointBase.TIMESTAMPS = [
  'hour',
  'datehour',
  'date',
  'week',
  'month'
];

/**
 * Validate timestamp.
 *
 * @method validateTimestamp
 * @protected
 *
 * @param string timestamp
 *
 * @return {String}
 */
ReportsActualsEndpointBase.prototype.validateTimestamp = function (timestamp) {
  if (!_.isString(timestamp) || (0 === timestamp.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "timestamp" provided type: "%s"', timestamp)
    );
  }

  timestamp = timestamp.trim().toLowerCase();

  if (!_.contains(ReportsActualsEndpointBase.TIMESTAMPS, timestamp)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "timestamp" provided choice: "%s"', timestamp)
    );
  }

  return timestamp;
};

/**
 * Counts all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method count
 *
 * @param string start_date        YYYY-MM-DD HH:MM:SS
 * @param string end_date          YYYY-MM-DD HH:MM:SS
 * @param string group             Group by one of more field names
 * @param string filter            Filter the results and apply conditions
 *                                that must be met for records to be
 *                                included in data.
 * @param string response_timezone Setting expected time for data
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.count = function (
  start_date,
  end_date,
  group,
  filter,
  response_timezone
) {
  // Required parameters
  this.validateDateTime('start_date', start_date);
  this.validateDateTime('end_date', end_date);

  // Optional parameters
  if (group) {
    group = this.validateGroup(group);
  }
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (response_timezone) {
    response_timezone = this.validateResponseTimezone(response_timezone);
  }

  var query_string_dict = {
    'start_date': start_date,
    'end_date': end_date,
    'group': group,
    'filter': filter,
    'response_timezone': response_timezone
  };

  return this.requestRecords(
    'count',
    query_string_dict
  );
};

/**
 * Finds all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method find
 *
 * @param string start_date         YYYY-MM-DD HH:MM:SS
 * @param string end_date           YYYY-MM-DD HH:MM:SS
 * @param string group              Group results using this endpoint's fields.
 * @param string filter             Filter the results and apply conditions that
 *                                must be met for records to be included
 *                                in data.
 * @param string fields             No value returns default fields, "*"
 *                                returns all available fields, or
 *                                provide specific fields.
 * @param integer limit             Limit number of results, default 10, 0
 *                                shows all.
 * @param integer page              Pagination, default 1.
 * @param array   sort               Sort by field name, ASC (default) or DESC
 * @param string  timestamp         Set to breakdown stats by timestamp choices:
 *                                hour, datehour, date, week, month.
 * @param string  response_timezone Setting expected timezone for data. Default
 *                                is set by account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.find = function (
  start_date,
  end_date,
  fields,
  group,
  filter,
  limit,
  page,
  sort,
  timestamp,
  response_timezone
) {
  // Required parameters
  this.validateDateTime('start_date', start_date);
  this.validateDateTime('end_date', end_date);

  // Optional parameters
  if (fields) {
    fields = this.validateFields(fields);
  }
  if (group) {
    group = this.validateGroup(group);
  }
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (limit) {
    limit = this.validateLimit(limit);
  }
  if (page) {
    page = this.validatePage(page);
  }
  if (sort) {
    sort = this.validateSort(sort);
  }
  if (timestamp) {
    timestamp = this.validateTimestamp(timestamp);
  }
  if (response_timezone) {
    response_timezone = this.validateResponseTimezone(response_timezone);
  }

  var query_string_dict = {
    'start_date': start_date,
    'end_date': end_date,
    'fields': fields,
    'group': group,
    'filter': filter,
    'limit': limit,
    'page': page,
    'sort': sort,
    'timestamp': timestamp,
    'response_timezone': response_timezone
  };

  return this.requestRecords(
    'find',
    query_string_dict
  );
};

/**
 * Places a job into a queue to generate a report that will contain
 * records that match provided filter criteria, and it returns a job
 * identifier to be provided to action /export/download.json to download
 * completed report.
 *
 * @method exportReport
 *
 * @param string start_date        YYYY-MM-DD HH:MM:SS
 * @param string end_date          YYYY-MM-DD HH:MM:SS
 * @param string fields            No value returns default fields, "*"
 *                                returns all available fields, or
 *                                provide specific fields.
 * @param string group             Group results using this endpoint's fields.
 * @param string filter            Filter the results and apply conditions that
 *                                must be met for records to be included
 *                                in data.
 * @param string timestamp         Set to breakdown stats by timestamp choices:
 *                                hour, datehour, date, week, month.
 * @param string format            Export format for downloaded report:
 *                                json, csv.
 * @param string response_timezone Setting expected timezone for data. Default
 *                                is set by account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.exportReport = function (
  start_date,
  end_date,
  fields,
  group,
  filter,
  timestamp,
  format,
  response_timezone
) {
  // Required parameters
  this.validateDateTime('start_date', start_date);
  this.validateDateTime('end_date', end_date);
  fields = this.validateFields(fields);

  // Optional parameters
  if (group) {
    group = this.validateGroup(group);
  }
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (timestamp) {
    timestamp = this.validateTimestamp(timestamp);
  }
  if (format) {
    format = this.validateFormat(format);
  } else {
    format = 'csv';
  }
  if (response_timezone) {
    response_timezone = this.validateResponseTimezone(response_timezone);
  }

  var query_string_dict = {
    'start_date': start_date,
    'end_date': end_date,
    'fields': fields,
    'group': group,
    'filter': filter,
    'timestamp': timestamp,
    'format': format,
    'response_timezone': response_timezone
  };

  return this.requestRecords(
    'find_export_queue',
    query_string_dict
  );
};

/**
 * Query status of insight reports. Upon completion will
 * return url to download requested report.
 *
 * @method statusReport
 *
 * @param string job_id    Provided Job Identifier to reference
 *                        requested report on export queue.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.statusReport = function (
  job_id
) {
  return this._statusReport(
    'export',
    'download',
    job_id
  );
};

/**
 * Helper function for fetching report upon completion.
 *
 * @method fetchReport
 *
 * @param string job_id        Job identifier assigned for report export.
 * @param bool   verbose       For debug purposes to monitor job export completion status.
 * @param int    sleep         Polling delay for checking job completion status.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.fetchReport = function (
  job_id,
  verbose,
  sleep,
  response
) {
  return this._fetchReport(
    'export',
    'download',
    job_id,
    verbose,
    sleep,
    response
  );
};

module.exports = ReportsActualsEndpointBase;