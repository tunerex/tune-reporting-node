#!/usr/bin/env node
/**
 * AdvertiserReportActualsBase.js, Abstract class for Advertiser Report Actuals.
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
 * @version   $Date: 2015-01-07 15:32:40 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

// Dependencies
var
  InvalidArgument = require('../../helpers').InvalidArgument,
  _ = require('lodash'),
  util = require('util'),
  AdvertiserReportBase = require('./AdvertiserReportBase');

/**
 * Base class intended for gathering from Advertiser Stats actuals.
 * @uses Stats
 * @uses Actuals
 *
 * @class AdvertiserReportActualsBase
 * @extends AdvertiserReportBase
 * @constructor
 *
 * @param string controller           TUNE Advertiser Report endpoint name.
 * @param bool   filterDebugMode      Remove debug mode information
 *                                    from results.
 * @param bool   filterTestProfileId  Remove test profile information
 *                                    from results.
 */
function AdvertiserReportActualsBase(
  controller,
  filterDebugMode,
  filterTestProfileId
) {
  AdvertiserReportActualsBase.super_.call(
    this,
    controller,
    filterDebugMode,
    filterTestProfileId
  );
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(AdvertiserReportActualsBase, AdvertiserReportBase);

/**
 * Available values for parameter 'timestamp'.
 *
 * @property TIMESTAMPS
 *
 * @type array
 * @static
 * @final
 */
AdvertiserReportActualsBase.TIMESTAMPS = [
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
AdvertiserReportActualsBase.prototype.validateTimestamp = function (timestamp) {
  if (!_.isString(timestamp) || (0 === timestamp.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "timestamp" provided type: "%s"', timestamp)
    );
  }

  timestamp = timestamp.trim().toLowerCase();

  if (!_.contains(AdvertiserReportActualsBase.TIMESTAMPS, timestamp)) {
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
AdvertiserReportActualsBase.prototype.count = function (
  startDate,
  endDate,
  group,
  filter,
  strResponseTimezone,
  callback
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
    },
    count_request = this.getReportRequest(
      'count',
      mapQueryString
    );

  // Success event response
  count_request.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  count_request.once('error', function onError(response) {
    callback(response, null);
  });
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
AdvertiserReportActualsBase.prototype.find = function (
  options,
  callback
) {

  // Required parameters
  this.validateDateTime('start_date', options.startDate);
  this.validateDateTime('end_date', options.endDate);

  // Optional parameters
  this.validateOptionalParams(
    options,
    [
      'fields',
      'group',
      'filter',
      'limit',
      'page',
      'sort',
      'timestamp',
      'responseTimezone'
    ]
  );

  var
    mapQueryString = {
      'start_date': options.startDate,
      'end_date': options.endDate,
      'fields': options.fields,
      'group': options.group,
      'filter': options.filter,
      'limit': options.limit,
      'page': options.page,
      'sort': options.sort,
      'timestamp': options.timestamp,
      'response_timezone': options.responseTimezone,
      'session_token': options.sessionToken,
      'api_key': options.apiKey
    },
    reportRequest = this.getReportRequest(
      'find',
      mapQueryString
    );

  // Success event response
  reportRequest.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  reportRequest.once('error', function onError(response) {
    callback(response, null);
  });
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
AdvertiserReportActualsBase.prototype.exportReport = function (
  startDate,
  endDate,
  fields,
  group,
  filter,
  timestamp,
  format,
  strResponseTimezone,
  callback
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

  var
    mapQueryString = {
      'start_date': startDate,
      'end_date': endDate,
      'fields': fields,
      'group': group,
      'filter': filter,
      'timestamp': timestamp,
      'format': format,
      'response_timezone': strResponseTimezone
    },
    reportRequest = this.getReportRequest(
      'find_export_queue',
      mapQueryString
    );

  // Success event response
  reportRequest.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  reportRequest.once('error', function onError(response) {
    callback(response, null);
  });
};

/**
 * Query status of insight reports. Upon completion will
 * return url to download requested report.
 *
 * @method statusReport
 *
 * @param string jobId      Provided Job Identifier to reference
 *                          requested report on export queue.
 * @param object callback   Error-first Callback.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportActualsBase.prototype.statusReport = function (
  jobId,
  callback
) {
  var status_request = this._statusReport(
    'export',
    'download',
    jobId
  );

  // Success event response
  status_request.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  status_request.once('error', function onError(response) {
    callback(response, null);
  });
};

/**
 * Helper function for fetching report upon completion.
 *
 * @method fetchReport
 *
 * @param string jobId      Job identifier assigned for report export.
 * @param object callback   Error-first Callback.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportActualsBase.prototype.fetchReport = function (
  jobId,
  callback
) {
  var fetch_request = this._fetchReport(
    'export',
    'download',
    jobId
  );

  // Success event response
  fetch_request.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  fetch_request.once('error', function onError(response) {
    callback(response, null);
  });
};

module.exports = AdvertiserReportActualsBase;