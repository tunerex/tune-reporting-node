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

// Dependencies
var
  InvalidArgument = require('../../helpers').InvalidArgument,
  TuneSdkError = require('../../helpers').TuneSdkError,
  TuneServiceError = require('../../helpers').TuneServiceError,
  _ = require('underscore'),
  util = require('util'),
  prettyjson = require('prettyjson'),
  ReportsEndpointBase = require('./ReportsEndpointBase');


/**
 * Base class intended for gathering from Advertiser Insights reports.
 * @uses LTV
 * @uses Retention
 *
 * @class ReportsInsightEndpointBase
 * @extends ReportsEndpointBase
 * @constructor
 *
 * @param string controller                Tune Management API endpoint name.
 * @param string api_key                   Tune MobileAppTracking API Key.
 * @param bool   filter_debug_mode         Remove debug mode information from results.
 * @param bool   filter_test_profile_id    Remove test profile information from results.
 * @param bool   validate_fields           Validate fields used by actions' parameters.
 */
function ReportsInsightEndpointBase(
  controller,
  api_key,
  filter_debug_mode,
  filter_test_profile_id,
  validate_fields
) {
  ReportsInsightEndpointBase.super_.call(
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
util.inherits(ReportsInsightEndpointBase, ReportsEndpointBase);

/**
 * @var array Available choices for Cohort intervals.
 *
 * @property COHORT_INTERVALS
 *
 * @type array
 * @static
 * @final
 */
ReportsInsightEndpointBase.COHORT_INTERVALS = [
  'year_day',
  'year_week',
  'year_month',
  'year'
];

/**
 * Validate cohort interval.
 *
 * @method validateCohortInterval
 * @protected
 *
 * @param string cohort_interval
 *
 * @return {String}
 */
ReportsInsightEndpointBase.prototype.validateCohortInterval = function (cohort_interval) {
  if (!_.isString(cohort_interval) || (0 === cohort_interval.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohort_interval" provided type: "%s"', cohort_interval)
    );
  }

  cohort_interval = cohort_interval.trim().toLowerCase();

  if (!_.contains(ReportsInsightEndpointBase.COHORT_INTERVALS, cohort_interval)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohort_interval" provided choice: "%s"', cohort_interval)
    );
  }

  return cohort_interval;
};

/**
 * @var array Available choices for Cohort types.
 *
 * @property COHORT_TYPES
 *
 * @type array
 * @static
 * @final
 */
ReportsInsightEndpointBase.COHORT_TYPES = [
  'click',
  'install'
];

/**
 * Validate cohort type.
 *
 * @method validateCohortType
 * @protected
 *
 * @param string cohort_type
 *
 * @return {String}
 */
ReportsInsightEndpointBase.prototype.validateCohortType = function (cohort_type) {
  if (!_.isString(cohort_type) || (0 === cohort_type.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohort_type" provided type: "%s"', cohort_type)
    );
  }

  cohort_type = cohort_type.trim().toLowerCase();

  if (!_.contains(ReportsInsightEndpointBase.COHORT_TYPES, cohort_type)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "cohort_type" provided choice: "%s"', cohort_type)
    );
  }

  return cohort_type;
};

/**
 * @var array Available choices for Aggregation types.
 *
 * @property AGGREGATION_TYPES
 *
 * @type array
 * @static
 * @final
 */
ReportsInsightEndpointBase.AGGREGATION_TYPES = [
  'incremental',
  'cumulative'
];

/**
 * Validate aggregation type.
 *
 * @method validateAggregationType
 * @protected
 *
 * @param string aggregation_type
 *
 * @return {String}
 */
ReportsInsightEndpointBase.prototype.validateAggregationType = function (aggregation_type) {
  if (!_.isString(aggregation_type) || (0 === aggregation_type.length)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "aggregation_type" provided type: "%s"', aggregation_type)
    );
  }

  aggregation_type = aggregation_type.trim().toLowerCase();

  if (!_.contains(ReportsInsightEndpointBase.AGGREGATION_TYPES, aggregation_type)) {
    throw new InvalidArgument(
      util.format('Invalid parameter "aggregation_type" provided choice: "%s"', aggregation_type)
    );
  }

  return aggregation_type;
};

/**
 * Counts all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method count
 *
 * @param string start_date        YYYY-MM-DD HH:MM:SS
 * @param string end_date          YYYY-MM-DD HH:MM:SS
 * @param string cohort_type       Cohort types: click, install
 * @param string cohort_interval   Cohort intervals: year_day, year_week, year_month, year
 * @param string group             Group results using this endpoint's fields.
 * @param string filter            Apply constraints based upon values associated with
 *                                this endpoint's fields.
 * @param string response_timezone Setting expected timezone for results,
 *                                default is set in account.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ReportsInsightEndpointBase.prototype.count = function (
  start_date,
  end_date,
  cohort_type,
  cohort_interval,
  group,
  filter,
  response_timezone
) {
  // Required parameters
  this.validateDateTime('start_date', start_date);
  this.validateDateTime('end_date', end_date);

  cohort_type = this.validateCohortType(cohort_type);
  cohort_interval = this.validateCohortInterval(cohort_interval);
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
    'group': group,
    'filter': filter,
    'cohort_type': cohort_type,
    'cohort_interval': cohort_interval,
    'response_timezone': response_timezone
  };

  return this.requestRecords(
    'count',
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
ReportsInsightEndpointBase.prototype.statusReport = function (
  job_id
) {
  return this._statusReport(
    this.getController(),
    'status',
    job_id
  );
};

/**
 * Helper function for parsing export status response to gather report job_id.
 *
 * @method parseResponseReportJobId
 *
 * @param response
 *
 * @return {String} Report URL for download.
 * @throws InvalidArgument
 * @throws TuneServiceError
 */
ReportsInsightEndpointBase.prototype.parseResponseReportJobId = function (
  response
) {
  if (!response) {
    throw new TuneServiceError("Parameter 'response' is not defined.");
  }
  var
    data = response.getData(),
    job_id;

  if (!data) {
    throw new TuneServiceError(
      util.format('Report request failed to get export data, response: "%s"', response.toString())
    );
  }

  if (!data.hasOwnProperty('job_id')) {
    throw new TuneServiceError(
      util.format(
        'Export data response does not contain "job_id": response: "%s"',
        prettyjson.render(data, {}, 2)
      )
    );
  }

  job_id = data.job_id;
  if (!_.isString(job_id) || (0 === job_id.length)) {
    throw new TuneSdkError(
      util.format('Report request failed return job_id: "%s"', response.toString())
    );
  }

  return job_id;
};

/**
 * Helper function for parsing export status response to gather report url.
 *
 * @method parseResponseReportUrl
 *
 * @param TuneManagementResponse response
 *
 * @return {String} Report job identifier within export queue.
 * @throws InvalidArgument
 * @throws TuneServiceError
 */
ReportsInsightEndpointBase.prototype.parseResponseReportUrl = function (
  response
) {
  if (!response) {
    throw new TuneServiceError("Parameter 'response' is not defined.");
  }
  var
    data = response.getData(),
    report_url;

  if (!data) {
    throw new TuneServiceError(
      util.format(
        'Report request failed to get export data, response: "%s"',
        response.toString()
      )
    );
  }

  if (!data.hasOwnProperty('url')) {
    throw new TuneServiceError(
      util.format(
        'Export data response does not contain "url": response: "%s"',
        prettyjson.render(data, {}, 2)
      )
    );
  }

  report_url = data.url;

  if (!_.isString(report_url) || (0 === report_url.length)) {
    throw new TuneSdkError(
      util.format('Report request failed return report_url: "%s"', response.toString())
    );
  }
  return report_url;
};

module.exports = ReportsInsightEndpointBase;