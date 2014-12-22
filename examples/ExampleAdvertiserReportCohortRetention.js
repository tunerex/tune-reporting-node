#!/usr/bin/env node
/**
 * ExampleAdvertiserReportCohortRetention.js, Example of TUNE Reporting API.
 *
 * @module examples
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-22 13:38:30 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

require('../lib/helpers/Date');

var
  tuneReporting = require('../lib'),
  _ = require('underscore'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  async = require('async'),
  AdvertiserReportCohortRetention = tuneReporting.api.AdvertiserReportCohortRetention,
  EndpointBase = tuneReporting.base.endpoints.EndpointBase,
  ReportReaderCSV = tuneReporting.helpers.ReportReaderCSV,
  ReportReaderJSON = tuneReporting.helpers.ReportReaderJSON,
  response;

try {
  var args = process.argv.slice(2);

  if (args.length !== 1) {
    throw new tuneReporting.helpers.InvalidArgument(null, 'api_key');
  }

  var
    apiKey = args[0],
    advertiserReport = new AdvertiserReportCohortRetention(
      apiKey,
      true
    ),

    startDate = new Date().setOneWeekAgo().setStartTime().getIsoDateTime(),
    endDate = new Date().setYesterday().setEndTime().getIsoDateTime(),

    strResponseTimezone = 'America/Los_Angeles',
    arrayFieldsRecommended = null,
    csvJobId = null,
    csv_report_url = null,
    json_job_id = null,
    json_report_url = null;

  async.series({
    taskStartExample: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: TUNE Advertiser Report Cohort Retention       '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    taskFieldsRecommended: function (next) {
      console.log('=============================================================');
      console.log(' Recommended Fields of Advertiser Report Cohort Retention.   ');
      console.log('=============================================================');
      console.log('\n');

      var fields_request = advertiserReport.getFields(
        EndpointBase.TUNE_FIELDS_RECOMMENDED
      );
      fields_request.once('success', function onSuccess(response) {
        console.log('\n');
        console.log('= Status: "success"');
        console.log('= TuneManagementResponse:');
        console.log(response);
        arrayFieldsRecommended = response;
        next();
      });

      fields_request.once('error', function onError(response) {
        return next(response);
      });
    },
    taskCount: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Count Advertiser Report Cohort Retention.                ');
      console.log('==========================================================');
      console.log('\n');
      var count_request = advertiserReport.count(
        startDate,
        endDate,
        'click',                                        // cohortType
        'year_day',                                     // cohortInterval
        'site_id,install_publisher_id',                 // group
        '(install_publisher_id > 0)',                   // filter
        strResponseTimezone
      );
      count_request.once('success', function onSuccess(response) {
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

      count_request.once('error', function onError(response) {
        return next(response);
      });

    },
    taskFind: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Cohort Retention.                 ');
      console.log('==========================================================');
      console.log('\n');
      var find_request = advertiserReport.find(
        startDate,
        endDate,
        'click',                                        // cohortType
        'year_day',                                     // cohortInterval
        arrayFieldsRecommended,                         // fields
        'site_id,install_publisher_id',                 // group
        '(install_publisher_id > 0)',                   // filter
        5,                                              // limit
        null,                                           // page
        null,                                           // sort
        strResponseTimezone
      );
      find_request.once('success', function onSuccess(response) {
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

      find_request.once('error', function onError(response) {
        return next(response);
      });

    },
    taskExportCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Cohort Retention CSV report.    ');
      console.log('==========================================================');
      console.log('\n');
      var export_request = advertiserReport.exportReport(
        startDate,
        endDate,
        'click',                                        // cohortType
        'year_day',                                     // cohortInterval
        arrayFieldsRecommended,                         // fields
        'site_id,install_publisher_id',                 // group
        '(install_publisher_id > 0)',                   // filter
        strResponseTimezone
      );
      export_request.once('success', function onSuccess(response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          csvJobId = advertiserReport.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= CSV Report Job ID: "%s"', csvJobId));
          next();
        }
      });

      export_request.once('error', function onError(response) {
        return next(response);
      });
    },
    taskFetchCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Fetch Advertiser Report Cohort Retention CSV report.     ');
      console.log('==========================================================');
      console.log('\n');
      var fetch_request = advertiserReport.fetchReport(
        csvJobId,
        true        // verbose
      );

      fetch_request.once('success', function onSuccess(response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          csv_report_url = advertiserReport.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= CSV Report URL: "%s"', csv_report_url));

          next();
        }
      });

      fetch_request.once('error', function onError(response) {
        return next(response);
      });
    },
    taskReadCsvReport: function (next) {

      console.log('\n');
      console.log('==========================================================');
      console.log(' Read Advertiser Report Cohort Retention CSV report.      ');
      console.log('==========================================================');
      console.log('\n');
      var
        csv_reader = new ReportReaderCSV(csv_report_url),
        print_request = csv_reader.prettyprint(5);

      print_request.once('success', function onSuccess(response) {
        console.log(response);
        next();
      });

      print_request.once('error', function onError(response) {
        return next(response);
      });

    },
    taskEndExample: function (next) {
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
        console.log(err);
      }
    });
} catch (err) {
  console.log('\n');
  console.log('= Exception: "error"'.red);
  console.log(err);
  console.log(stackTrace.parse(err));
}