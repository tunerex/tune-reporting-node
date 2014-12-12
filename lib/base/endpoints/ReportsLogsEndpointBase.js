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
 * @version   $Date: 2014-12-12 11:53:57 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

// Dependencies
var
  _ = require('underscore'),
  util = require('util'),
  ReportsEndpointBase = require('./ReportsEndpointBase');

/**
 * Base class intended for gathering from Advertiser Stats logs.
 * @uses Clicks
 * @uses EventItems
 * @uses Events
 * @uses Installs
 * @uses Postbacks
 *
 * @class ReportsLogsEndpointBase
 * @extends ReportsEndpointBase
 * @constructor
 *
 * @param string controller                Tune Management API endpoint name.
 * @param string apiKey                   Tune MobileAppTracking API Key.
 * @param bool   filterDebugMode         Remove debug mode information from results.
 * @param bool   filterTestProfileId    Remove test profile information from results.
 * @param bool   verifyFields                  Validate fields used by actions' parameters.
 */
function ReportsLogsEndpointBase(
  controller,
  apiKey,
  filterDebugMode,
  filterTestProfileId,
  verifyFields
) {
  ReportsLogsEndpointBase.super_.call(
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
util.inherits(ReportsLogsEndpointBase, ReportsEndpointBase);

/**
 * Counts all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method count
 *
 * @param string startDate        YYYY-MM-DD HH:MM:SS
 * @param string endDate          YYYY-MM-DD HH:MM:SS
 * @param string filter            Filter the results and apply conditions
 *                                that must be met for records to be
 *                                included in data.
 * @param string strResponseTimezone Setting expected time for data.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsLogsEndpointBase.prototype.count = function (
  startDate,
  endDate,
  filter,
  strResponseTimezone
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

  // Optional parameters
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (strResponseTimezone) {
    strResponseTimezone = this.validateResponseTimezone(strResponseTimezone);
  }

  var mapQueryString = {
    'start_date': startDate,
    'end_date': endDate,
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
 * @param string startDate            YYYY-MM-DD HH:MM:SS
 * @param string endDate              YYYY-MM-DD HH:MM:SS
 * @param string fields                No value returns default fields, " * "
 *                                    returns all available fields,
 *                                    or provide specific fields.
 * @param string filter                Filter the results and apply conditions
 *                                    that must be met for records to be
 *                                    included in data.
 * @param int    limit                 Limit number of results, default 10,
 *                                    0 shows all.
 * @param int    page                  Pagination, default 1.
 * @param dict   sort                  Expression defining sorting found
 *                                    records in result set base upon provided
 *                                    fields and its modifier (ASC or DESC).
 * @param string strResponseTimezone     Setting expected timezone for results,
 *                                    default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsLogsEndpointBase.prototype.find = function (
  startDate,
  endDate,
  fields,
  filter,
  limit,
  page,
  sort,
  strResponseTimezone
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

  // Optional parameters
  if (fields) {
    fields = this.validateFields(fields);
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
  if (strResponseTimezone) {
    strResponseTimezone = this.validateResponseTimezone(strResponseTimezone);
  }

  var mapQueryString = {
    'start_date': startDate,
    'end_date': endDate,
    'filter': filter,
    'fields': fields,
    'sort': sort,
    'limit': limit,
    'page': page,
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
 * @param string startDate            YYYY-MM-DD HH:MM:SS
 * @param string endDate              YYYY-MM-DD HH:MM:SS
 * @param string fields                Provide fields if format is 'csv'.
 * @param string filter                Filter the results and apply conditions
 *                                    that must be met for records to be
 *                                    included in data.
 * @param string format                Export format: csv, json
 * @param string strResponseTimezone     Setting expected timezone for results,
 *                                    default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsLogsEndpointBase.prototype.exportReport = function (
  startDate,
  endDate,
  fields,
  filter,
  format,
  strResponseTimezone
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

  // Optional parameters
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (fields) {
    fields = this.validateFields(fields);
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
    'filter': filter,
    'fields': fields,
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
ReportsLogsEndpointBase.prototype.statusReport = function (
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
 * @param bool   verbose       For debug purposes to monitor job export
 *                            completion status.
 * @param int    sleep         Polling delay for checking job completion status.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsLogsEndpointBase.prototype.fetchReport = function (
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

module.exports = ReportsLogsEndpointBase;