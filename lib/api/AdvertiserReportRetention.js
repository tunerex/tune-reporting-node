#!/usr/bin/env node
/**
 * Classes that define advertiser/stats Tune Management API endpoints.
 *
 * @module tune-reporting
 * @submodule api
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

// Dependencies
var
  util = require('util'),
  ReportsInsightEndpointBase = require('../base/endpoints').ReportsInsightEndpointBase;

/**
 * Tune Management API endpoint '/advertiser/stats/retention/'.
 *
 * @class AdvertiserReportRetention
 * @constructor
 * @extends ReportsInsightEndpointBase
 *
 */
function AdvertiserReportRetention(
  api_key,
  validate_fields
) {
  AdvertiserReportRetention.super_.call(
    this,
    "advertiser/stats/retention",
    api_key,
    false,
    true,
    validate_fields
  );
}

util.inherits(AdvertiserReportRetention, ReportsInsightEndpointBase);

/**
 * Get list of recommended fields for endpoint.
 *
 * @property getFieldsRecommended
 * @protected
 * @return {Array}
 */
AdvertiserReportRetention.prototype.getFieldsRecommended = function () {
  return [
    'site_id',
    'site.name',
    'install_publisher_id',
    'install_publisher.name',
    'installs',
    'opens'
  ];
};

/**
 * Finds all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method find
 *
 * @param string start_date        YYYY-MM-DD HH:MM:SS
 * @param string end_date          YYYY-MM-DD HH:MM:SS
 * @param string cohort_type       Cohort types: click, install
 * @param string cohort_interval   Cohort intervals: year_day, year_week, year_month, year
 * @param string fields            Present results using these endpoint's fields.
 * @param string group             Group results using this endpoint's fields.
 * @param string filter            Apply constraints based upon values associated with
 *                                  this endpoint's fields.
 * @param int    limit             Limit number of results, default 10, 0 shows all
 * @param int    page              Pagination, default 1.
 * @param string sort              Sort results using this endpoint's fields. Directions: DESC, ASC
 * @param string format
 * @param string response_timezone Setting expected timezone for results,
 *                                  default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportRetention.prototype.find = function (
  start_date,
  end_date,
  cohort_type,
  cohort_interval,
  fields,
  group,
  filter,
  limit,
  page,
  sort,
  response_timezone
) {
  // Required parameters
  this.validateDateTime('start_date', start_date);
  this.validateDateTime('end_date', end_date);

  cohort_type = this.validateCohortType(cohort_type);
  cohort_interval = this.validateCohortInterval(cohort_interval);

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
  if (response_timezone) {
    response_timezone = this.validateResponseTimezone(response_timezone);
  }

  var query_string_dict = {
    'start_date': start_date,
    'end_date': end_date,
    'cohort_type': cohort_type,
    'interval': cohort_interval,
    'fields': fields,
    'group': group,
    'filter': filter,
    'limit': limit,
    'page': page,
    'sort': sort,
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
 * @param string cohort_type       Cohort types: click, install.
 * @param string cohort_interval   Cohort intervals: year_day, year_week, year_month, year.
 * @param string fields            Present results using these endpoint's fields.
 * @param string group             Group results using this endpoint's fields.
 * @param string filter            Apply constraints based upon values associated with
 *                                  this endpoint's fields.
 * @param string response_timezone Setting expected timezone for results,
 *                                  default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
AdvertiserReportRetention.prototype.exportReport = function (
  start_date,
  end_date,
  cohort_type,
  cohort_interval,
  fields,
  group,
  filter,
  response_timezone
) {
  // Required parameters
  this.validateDateTime('start_date', start_date);
  this.validateDateTime('end_date', end_date);

  cohort_type = this.validateCohortType(cohort_type);
  cohort_interval = this.validateCohortInterval(cohort_interval);

  fields = this.validateFields(fields);
  group = this.validateGroup(group);

  // Optional parameters
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (response_timezone) {
    response_timezone = this.validateResponseTimezone(response_timezone);
  }

  var query_string_dict = {
    'start_date': start_date,
    'end_date': end_date,
    'cohort_type': cohort_type,
    'interval': cohort_interval,
    'fields': fields,
    'group': group,
    'filter': filter,
    'response_timezone': response_timezone
  };

  return this.requestRecords(
    'export',
    query_string_dict
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
AdvertiserReportRetention.prototype.fetchReport = function (
  job_id,
  verbose,
  sleep,
  response
) {
  return this._fetchReport(
    this.getController(),
    'status',
    job_id,
    verbose,
    sleep,
    response
  );
};

module.exports = AdvertiserReportRetention;