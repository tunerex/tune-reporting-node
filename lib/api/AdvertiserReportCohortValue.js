#!/usr/bin/env node
/**
 * AdvertiserReportCohortValue.js, TUNE Reporting SDK class.
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
 * @version   $Date: 2015-01-06 14:33:18 $
 * @link      http://developers.mobileapptracking.com @endlink
 */

// Dependencies
var
  util = require('util'),
  AdvertiserReportCohortBase = require('../base/endpoints').AdvertiserReportCohortBase;

/**
 * TUNE Advertiser Report endpoint '/advertiser/stats/ltv/'.
 *
 * @class AdvertiserReportCohortValue
 * @constructor
 * @extends AdvertiserReportCohortBase
 *
 */
function AdvertiserReportCohortValue() {
  AdvertiserReportCohortValue.super_.call(
    this,
    "advertiser/stats/ltv",
    false,
    true
  );
}

util.inherits(AdvertiserReportCohortValue, AdvertiserReportCohortBase);

/**
 * Get list of recommended fields for endpoint.
 *
 * @property getFieldsRecommended
 * @protected
 * @return {Array}
 */
AdvertiserReportCohortValue.prototype.getFieldsRecommended = function () {
  return [
    'site_id',
    'site.name',
    'publisher_id',
    'publisher.name',
    'rpi',
    'epi'
  ];
};

/**
 * Finds all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method find
 *
 * @param string startDate        YYYY-MM-DD HH:MM:SS
 * @param string endDate          YYYY-MM-DD HH:MM:SS
 * @param string cohortType       Cohort types: click, install
 * @param string cohortInterval   Cohort intervals: year_day, year_week, year_month, year
 * @param string aggregationType  Aggregation types: cumulative, incremental.
 * @param string fields            Present results using these endpoint's fields.
 * @param string group             Group results using this endpoint's fields.
 * @param string filter            Apply constraints based upon values associated with
 *                                  this endpoint's fields.
 * @param int    limit             Limit number of results, default 10, 0 shows all
 * @param int    page              Pagination, default 1.
 * @param string sort              Sort results using this endpoint's fields. Directions: DESC, ASC
 * @param string format
 * @param string strResponseTimezone Setting expected timezone for results,
 *                                  default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportCohortValue.prototype.find = function (
  startDate,
  endDate,
  cohortType,
  cohortInterval,
  aggregationType,
  fields,
  group,
  filter,
  limit,
  page,
  sort,
  strResponseTimezone,
  callback
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

  cohortType = this.validateCohortType(cohortType);
  cohortInterval = this.validateCohortInterval(cohortInterval);
  aggregationType = this.validateAggregationType(aggregationType);

  fields = this.validateFields(fields);
  group = this.validateGroup(group);

  // Optional parameters
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

  var
    mapQueryString = {
      'start_date': startDate,
      'end_date': endDate,
      'cohort_type': cohortType,
      'interval': cohortInterval,
      'aggregation_type': aggregationType,
      'fields': fields,
      'group': group,
      'filter': filter,
      'limit': limit,
      'page': page,
      'sort': sort,
      'response_timezone': strResponseTimezone
    },
    find_request = this.getReportRequest(
      'find',
      mapQueryString
    );

  // Success event response
  find_request.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  find_request.once('error', function onError(response) {
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
 * @param string cohortType       Cohort types: click, install.
 * @param string cohortInterval   Cohort intervals: year_day, year_week, year_month, year.
 * @param string aggregationType  Aggregation types: cumulative, incremental.
 * @param string fields            Present results using these endpoint's fields.
 * @param string group             Group results using this endpoint's fields.
 * @param string filter            Apply constraints based upon values associated with
 *                                  this endpoint's fields.
 * @param string strResponseTimezone Setting expected timezone for results,
 *                                  default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportCohortValue.prototype.exportReport = function (
  startDate,
  endDate,
  cohortType,
  cohortInterval,
  aggregationType,
  fields,
  group,
  filter,
  strResponseTimezone,
  callback
) {
  // Required parameters
  this.validateDateTime('start_date', startDate);
  this.validateDateTime('end_date', endDate);

  cohortType = this.validateCohortType(cohortType);
  cohortInterval = this.validateCohortInterval(cohortInterval);
  aggregationType = this.validateAggregationType(aggregationType);

  fields = this.validateFields(fields);
  group = this.validateGroup(group);

  // Optional parameters
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (strResponseTimezone) {
    strResponseTimezone = this.validateResponseTimezone(strResponseTimezone);
  }

  var
    mapQueryString = {
      'start_date': startDate,
      'end_date': endDate,
      'cohort_type': cohortType,
      'interval': cohortInterval,
      'aggregation_type': aggregationType,
      'fields': fields,
      'group': group,
      'filter': filter,
      'response_timezone': strResponseTimezone
    },
    export_request = this.getReportRequest(
      'export',
      mapQueryString
    );

  // Success event response
  export_request.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  export_request.once('error', function onError(response) {
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
AdvertiserReportCohortValue.prototype.fetchReport = function (
  jobId,
  callback
) {
  var fetch_request = this._fetchReport(
    this.getController(),
    'status',
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


module.exports = AdvertiserReportCohortValue;