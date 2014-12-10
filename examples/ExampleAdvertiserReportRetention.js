#!/usr/bin/env node
/**
 * Examples of Tune Reporting API
 *
 * @module tune-reporting
 * @submodule examples
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

require('../lib/helpers/Date');

var
  tune_reporting = require('../lib'),
  _ = require('underscore'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  async = require('async'),
  AdvertiserReportRetention = tune_reporting.api.AdvertiserReportRetention,
  EndpointBase = tune_reporting.base.endpoints.EndpointBase,
  ReportReaderCSV = tune_reporting.helpers.ReportReaderCSV,
  ReportReaderJSON = tune_reporting.helpers.ReportReaderJSON,
  response;

try {
  var args = process.argv.slice(2);

  if (args.length !== 1) {
    throw new tune_reporting.helpers.InvalidArgument(null, 'api_key');
  }

  var
    api_key = args[0],
    endpointAdvertiserReportRetention = new AdvertiserReportRetention(
      api_key,
      true
    ),
    // Set start date to the start of one week ago.
    dateWeekAgo = new Date(),
    week_ago = dateWeekAgo.oneWeekAgoDate(),
    start_date = dateWeekAgo.startDateTime(week_ago),

    // Set end date to end of yesterday.
    date_yesterday = new Date(),
    yesterday = date_yesterday.yesterdayDate(),
    end_date = date_yesterday.endDateTime(yesterday),

    response_timezone = 'America/Los_Angeles',
    fields_recommended = null,
    csv_job_id = null,
    csv_report_url = null,
    json_job_id = null,
    json_report_url = null;

  async.series({
    startExample: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: Tune Management API Retention                 '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    fields_recommended: function (next) {
      console.log('======================================================');
      console.log(' Fields of Retention.                                 ');
      console.log('======================================================');
      console.log('\n');

      var fields_request = endpointAdvertiserReportRetention.getFields(
        EndpointBase.TUNE_FIELDS_RECOMMENDED
      );
      fields_request.once('success', function (response) {
        console.log('\n');
        console.log('= Status: "success"');
        console.log('= TuneManagementResponse:');
        console.log(response);
        fields_recommended = response;
        next();
      });

      fields_request.once('error', function (response) {
        return next(response);
      });
    },
    count: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Count Retention.                            ');
      console.log('======================================================');
      console.log('\n');
      var count_request = endpointAdvertiserReportRetention.count(
        start_date,
        end_date,
        'click',                                        // cohort_type
        'year_day',                                     // cohort_interval
        'site_id,install_publisher_id',                 // group
        '(install_publisher_id > 0)',                   // filter
        response_timezone
      );
      count_request.once('success', function (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {
          var count = response.getData();

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          console.log('\n');
          console.log(util.format('= Count: %d', count));
          next();
        }
      });

      count_request.once('error', function (response) {
        return next(response);
      });

    },
    find: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Find Retention.                            ');
      console.log('======================================================');
      console.log('\n');
      var find_request = endpointAdvertiserReportRetention.find(
        start_date,
        end_date,
        'click',                                        // cohort_type
        'year_day',                                     // cohort_interval
        fields_recommended,                             // fields
        'site_id,install_publisher_id',                 // group
        '(install_publisher_id > 0)',                   // filter
        5,                                              // limit
        null,                                           // page
        null,                                           // sort
        response_timezone
      );
      find_request.once('success', function (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());
          next();
        }
      });

      find_request.once('error', function (response) {
        return next(response);
      });

    },
    exportCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Export Retention CSV report.                            ');
      console.log('======================================================');
      console.log('\n');
      var export_request = endpointAdvertiserReportRetention.exportReport(
        start_date,
        end_date,
        'click',                                        // cohort_type
        'year_day',                                     // cohort_interval
        fields_recommended,                             // fields
        'site_id,install_publisher_id',                 // group
        '(install_publisher_id > 0)',                   // filter
        response_timezone
      );
      export_request.once('success', function (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          csv_job_id = endpointAdvertiserReportRetention.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= CSV Report Job ID: "%s"', csv_job_id));
          next();
        }
      });

      export_request.once('error', function (response) {
        return next(response);
      });
    },
    fetchCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Fetch Retention CSV report.                         ');
      console.log('======================================================');
      console.log('\n');
      var fetch_request = endpointAdvertiserReportRetention.fetchReport(
        csv_job_id,
        true        // verbose
      );

      fetch_request.once('success', function (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          csv_report_url = endpointAdvertiserReportRetention.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= CSV Report URL: "%s"', csv_report_url));

          next();
        }
      });

      fetch_request.once('error', function (response) {
        return next(response);
      });
    },
    readCsvReport: function (next) {

      console.log('\n');
      console.log('======================================================');
      console.log(' Read Account Users CSV report.                       ');
      console.log('======================================================');
      console.log('\n');
      var
        csv_reader = new ReportReaderCSV(csv_report_url),
        print_request = csv_reader.prettyprint(5);

      print_request.once('success', function (response) {
        console.log(response);
        next();
      });

      print_request.once('error', function (response) {
        return next(response);
      });

    },
    endExample: function (next) {
      console.log('\n');
      console.log('======================================================'.green);
      console.log(' End Example                                          '.green);
      console.log('======================================================'.green);
      console.log('\n');
      next();
    }
  },
    function (err) {
      if (err) {
        console.log('\n');
        console.log('= Status: "error"'.red);
        console.log('= TuneManagementResponse:');
        console.log(err.toString());
      }
    });
} catch (err) {
  console.log('\n');
  console.log('= Exception: "error"'.red);
  console.log(err);
  console.log(stackTrace.parse(err));
}