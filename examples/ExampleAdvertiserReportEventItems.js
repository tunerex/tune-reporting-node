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
 * @version   $Date: 2014-12-12 11:53:57 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

var
  tuneReporting = require('../lib'),
  _ = require('underscore'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  async = require('async'),
  AdvertiserReportEventItems = tuneReporting.api.AdvertiserReportEventItems,
  EndpointBase = tuneReporting.base.endpoints.EndpointBase,
  ReportReaderCSV = tuneReporting.helpers.ReportReaderCSV,
  ReportReaderJSON = tuneReporting.helpers.ReportReaderJSON,
  response;

require('../lib/helpers/Date');

try {
  var args = process.argv.slice(2);

  if (args.length !== 1) {
    throw new tuneReporting.helpers.InvalidArgument(null, 'api_key');
  }

  var
    apiKey = args[0],
    endpointAdvertiserReportEventItems = new AdvertiserReportEventItems(
      apiKey,
      true
    ),

    startDate = new Date().setYesterday().setStartTime().getIsoDateTime(),
    endDate = new Date().setYesterday().setEndTime().getIsoDateTime(),

    strResponseTimezone = 'America/Los_Angeles',
    fieldsRecommended = null,
    csvJobId = null,
    csv_report_url = null,
    json_job_id = null,
    json_report_url = null;

  async.series({
    startExample: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: Tune Management API Log Event Items           '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    fieldsRecommended: function (next) {
      console.log('======================================================');
      console.log(' Fields of Log Event Items.                        ');
      console.log('======================================================');
      console.log('\n');

      var fields_request = endpointAdvertiserReportEventItems.getFields(
        EndpointBase.TUNE_FIELDS_RECOMMENDED
      );
      fields_request.once('success', function onSuccess (response) {
        console.log('\n');
        console.log('= Status: "success"');
        console.log('= TuneManagementResponse:');
        console.log(response);
        fieldsRecommended = response;
        next();
      });

      fields_request.once('error', function onError (response) {
        return next(response);
      });
    },
    count: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Count Log Event Items.                            ');
      console.log('======================================================');
      console.log('\n');
      var count_request = endpointAdvertiserReportEventItems.count(
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
    find: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Find Log Event Items.                            ');
      console.log('======================================================');
      console.log('\n');
      var find_request = endpointAdvertiserReportEventItems.find(
        startDate,
        endDate,
        fieldsRecommended,
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
    exportCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Export Log Event Items CSV report.                            ');
      console.log('======================================================');
      console.log('\n');
      var export_request = endpointAdvertiserReportEventItems.exportReport(
        startDate,
        endDate,
        fieldsRecommended,
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

          csvJobId = endpointAdvertiserReportEventItems.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= CSV Report Job ID: "%s"', csvJobId));
          next();
        }
      });

      export_request.once('error', function onError (response) {
        return next(response);
      });
    },
    fetchCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Fetch Log Event Items CSV report.                         ');
      console.log('======================================================');
      console.log('\n');
      var fetch_request = endpointAdvertiserReportEventItems.fetchReport(
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

          csv_report_url = endpointAdvertiserReportEventItems.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= CSV Report URL: "%s"', csv_report_url));

          next();
        }
      });

      fetch_request.once('error', function onError (response) {
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

      print_request.once('success', function onSuccess (response) {
        console.log(response);
        next();
      });

      print_request.once('error', function onError (response) {
        return next(response);
      });

    },
    exportJsonReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Export Log Event Items JSON report.                            ');
      console.log('======================================================');
      console.log('\n');
      var export_request = endpointAdvertiserReportEventItems.exportReport(
        startDate,
        endDate,
        fieldsRecommended,
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

          json_job_id = endpointAdvertiserReportEventItems.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= JSON Report Job ID: "%s"', json_job_id));
          next();
        }
      });

      export_request.once('error', function onError (response) {
        return next(response);
      });
    },
    fetchJsonReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Fetch Log Event Items JSON report.                         ');
      console.log('======================================================');
      console.log('\n');
      var fetch_request = endpointAdvertiserReportEventItems.fetchReport(
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

          json_report_url = endpointAdvertiserReportEventItems.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= JSON Report URL: "%s"', json_report_url));

          next();
        }
      });

      fetch_request.once('error', function onError (response) {
        return next(response);
      });
    },
    readJsonReport: function (next) {

      console.log('\n');
      console.log('======================================================');
      console.log(' Read Account Users JSON report.                       ');
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