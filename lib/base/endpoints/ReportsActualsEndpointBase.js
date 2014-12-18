#!/usr/bin/env node
/**
 * Classes that define TUNE Management API endpoints base functionality.
 *
 * @module base
 * @submodule endpoints
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-18 14:57:59 $
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
 * @param string controller                TUNE Management API endpoint name.
 * @param string apiKey                   TUNE MobileAppTracking API Key.
 * @param bool   filterDebugMode         Remove debug mode information
 *                                        from results.
 * @param bool   filterTestProfileId    Remove test profile information
 *                                        from results.
 * @param bool   verifyFields           Validate fields used by actions'
 *                                        parameters.
 */
function ReportsActualsEndpointBase(
  controller,
  apiKey,
  filterDebugMode,
  filterTestProfileId,
  verifyFields
) {
  ReportsActualsEndpointBase.super_.call(
    this,
    controller,
    apiKey,
    filterDebugMode,
    filterTestProfileId,
    verifyFields
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
 * @param string startDate        YYYY-MM-DD HH:MM:SS
 * @param string endDate          YYYY-MM-DD HH:MM:SS
 * @param string group             Group by one of more field names
 * @param string filter            Filter the results and apply conditions
 *                                that must be met for records to be
 *                                included in data.
 * @param string strResponseTimezone Setting expected time for data
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.count = function (
  startDate,
  endDate,
  group,
  filter,
  strResponseTimezone
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

  // Optional parameters
  if (group) {
    group = this.validateGroup(group);
  }
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (strResponseTimezone) {
    strResponseTimezone = this.validateResponseTimezone(strResponseTimezone);
  }

  var mapQueryString = {
    'start_date': startDate,
    'end_date': endDate,
    'group': group,
    'filter': filter,
    'response_timezone': strResponseTimezone
  };

  return this.requestRecords(
    'count',
    mapQueryString
  );
};

/**
 * Finds all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method find
 *
 * @param string startDate         YYYY-MM-DD HH:MM:SS
 * @param string endDate           YYYY-MM-DD HH:MM:SS
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
 * @param string  strResponseTimezone Setting expected timezone for data. Default
 *                                is set by account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.find = function (
  startDate,
  endDate,
  fields,
  group,
  filter,
  limit,
  page,
  sort,
  timestamp,
  strResponseTimezone
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

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
  if (strResponseTimezone) {
    strResponseTimezone = this.validateResponseTimezone(strResponseTimezone);
  }

  var mapQueryString = {
    'start_date': startDate,
    'end_date': endDate,
    'fields': fields,
    'group': group,
    'filter': filter,
    'limit': limit,
    'page': page,
    'sort': sort,
    'timestamp': timestamp,
    'response_timezone': strResponseTimezone
  };

  return this.requestRecords(
    'find',
    mapQueryString
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
 * @param string startDate        YYYY-MM-DD HH:MM:SS
 * @param string endDate          YYYY-MM-DD HH:MM:SS
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
 * @param string strResponseTimezone Setting expected timezone for data. Default
 *                                is set by account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.exportReport = function (
  startDate,
  endDate,
  fields,
  group,
  filter,
  timestamp,
  format,
  strResponseTimezone
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);
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
  if (strResponseTimezone) {
    strResponseTimezone = this.validateResponseTimezone(strResponseTimezone);
  }

  var mapQueryString = {
    'start_date': startDate,
    'end_date': endDate,
    'fields': fields,
    'group': group,
    'filter': filter,
    'timestamp': timestamp,
    'format': format,
    'response_timezone': strResponseTimezone
  };

  return this.requestRecords(
    'find_export_queue',
    mapQueryString
  );
};

/**
 * Query status of insight reports. Upon completion will
 * return url to download requested report.
 *
 * @method statusReport
 *
 * @param string jobId    Provided Job Identifier to reference
 *                        requested report on export queue.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.statusReport = function (
  jobId
) {
  return this._statusReport(
    'export',
    'download',
    jobId
  );
};

/**
 * Helper function for fetching report upon completion.
 *
 * @method fetchReport
 *
 * @param string jobId        Job identifier assigned for report export.
 * @param bool   verbose       For debug purposes to monitor job export completion status.
 * @param int    sleep         Polling delay for checking job completion status.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsActualsEndpointBase.prototype.fetchReport = function (
  jobId,
  verbose,
  sleep,
  response
) {
  return this._fetchReport(
    'export',
    'download',
    jobId,
    verbose,
    sleep,
    response
  );
};

module.exports = ReportsActualsEndpointBase;