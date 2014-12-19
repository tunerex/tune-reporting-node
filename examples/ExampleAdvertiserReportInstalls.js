#!/usr/bin/env node
/**
 * Examples of TUNE Reporting API
 *
 * @module tune-reporting
 * @submodule examples
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-18 17:16:13 $
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
  AdvertiserReportInstalls = tuneReporting.api.AdvertiserReportInstalls,
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
    advertiserReportInstalls = new AdvertiserReportInstalls(
      apiKey,
      true
    ),
    startDate = new Date().setYesterday().setStartTime().getIsoDateTime(),
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
      console.log(' Begin: TUNE Advertiser Report Installs               '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    taskFieldsRecommended: function (next) {
      console.log('======================================================');
      console.log(' Recommended Fields of Advertiser Report Installs.    ');
      console.log('======================================================');
      console.log('\n');

      var fields_request = advertiserReportInstalls.getFields(
        EndpointBase.TUNE_FIELDS_RECOMMENDED
      );
      fields_request.once('success', function onSuccess (response) {
        console.log('\n');
        console.log('= Status: "success"');
        console.log('= TuneManagementResponse:');
        console.log(response);
        arrayFieldsRecommended = response;
        next();
      });

      fields_request.once('error', function onError (response) {
        return next(response);
      });
    },
    taskCount: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Count Advertiser Report Installs.                    ');
      console.log('======================================================');
      console.log('\n');
      var count_request = advertiserReportInstalls.count(
        startDate,
        endDate,
        null,                                           // filter
        strResponseTimezone
      );
      count_request.once('success', function onSuccess (response) {
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

      count_request.once('error', function onError (response) {
        return next(response);
      });

    },
    taskFind: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Find Advertiser Report Installs.                     ');
      console.log('======================================================');
      console.log('\n');
      var find_request = advertiserReportInstalls.find(
        startDate,
        endDate,
        arrayFieldsRecommended,
        null,                                           // filter
        5,                                              // limit
        null,                                           // page
        { 'created': 'DESC' },                          // sort
        strResponseTimezone
      );
      find_request.once('success', function onSuccess (response) {
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

      find_request.once('error', function onError (response) {
        return next(response);
      });

    },
    taskExportCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Export Advertiser Report Installs CSV report.        ');
      console.log('======================================================');
      console.log('\n');
      var export_request = advertiserReportInstalls.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,
        null,                                           // filter
        'csv',                                          // format
        strResponseTimezone
      );
      export_request.once('success', function onSuccess (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          csvJobId = advertiserReportInstalls.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= CSV Report Job ID: "%s"', csvJobId));
          next();
        }
      });

      export_request.once('error', function onError (response) {
        return next(response);
      });
    },
    taskFetchCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Fetch Advertiser Report Installs CSV report.         ');
      console.log('======================================================');
      console.log('\n');
      var fetch_request = advertiserReportInstalls.fetchReport(
        csvJobId,
        true        // verbose
      );

      fetch_request.once('success', function onSuccess (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          csv_report_url = advertiserReportInstalls.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= CSV Report URL: "%s"', csv_report_url));

          next();
        }
      });

      fetch_request.once('error', function onError (response) {
        return next(response);
      });
    },
    taskReadCsvReport: function (next) {

      console.log('\n');
      console.log('======================================================');
      console.log(' Read Advertiser Report Installs CSV report.          ');
      console.log('======================================================');
      console.log('\n');
      var
        csv_reader = new ReportReaderCSV(csv_report_url),
        print_request = csv_reader.prettyprint(5);

      print_request.once('success', function onSuccess (response) {
        console.log(response);
        next();
      });

      print_request.once('error', function onError (response) {
        return next(response);
      });

    },
    taskExportJsonReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Export Advertiser Report Installs JSON report.       ');
      console.log('======================================================');
      console.log('\n');
      var export_request = advertiserReportInstalls.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,
        null,                                           // filter
        'json',                                          // format
        strResponseTimezone
      );
      export_request.once('success', function onSuccess (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          json_job_id = advertiserReportInstalls.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= JSON Report Job ID: "%s"', json_job_id));
          next();
        }
      });

      export_request.once('error', function onError (response) {
        return next(response);
      });
    },
    taskFetchJsonReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Fetch Advertiser Report Installs JSON report.        ');
      console.log('======================================================');
      console.log('\n');
      var fetch_request = advertiserReportInstalls.fetchReport(
        json_job_id,
        true        // verbose
      );

      fetch_request.once('success', function onSuccess (response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          json_report_url = advertiserReportInstalls.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= JSON Report URL: "%s"', json_report_url));

          next();
        }
      });

      fetch_request.once('error', function onError (response) {
        return next(response);
      });
    },
    taskReadJsonReport: function (next) {

      console.log('\n');
      console.log('======================================================');
      console.log(' Read Advertiser Report Installs JSON report.         ');
      console.log('======================================================');
      console.log('\n');
      var
        json_reader = new ReportReaderJSON(json_report_url),
        print_request = json_reader.prettyprint(5);

      print_request.once('success', function onSuccess (response) {
        console.log(response);
        next();
      });

      print_request.once('error', function onError (response) {
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