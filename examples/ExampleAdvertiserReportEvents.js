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

var
  tune_reporting = require('../lib'),
  _ = require('underscore'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  async = require('async'),
  AdvertiserReportEvents = tune_reporting.api.AdvertiserReportEvents,
  EndpointBase = tune_reporting.base.endpoints.EndpointBase,
  ReportReaderCSV = tune_reporting.helpers.ReportReaderCSV,
  ReportReaderJSON = tune_reporting.helpers.ReportReaderJSON,
  response;

require('../lib/helpers/Date');

try {
  var args = process.argv.slice(2);

  if (args.length !== 1) {
    throw new tune_reporting.helpers.InvalidArgument(null, 'api_key');
  }

  var
    api_key = args[0],
    endpointAdvertiserReportEvents = new AdvertiserReportEvents(
      api_key,
      true
    ),
    date = new Date(),
    yesterday = date.yesterdayDate(),
    start_date = date.startDateTime(yesterday),
    end_date = date.endDateTime(yesterday),
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
      console.log(' Begin: Tune Management API Log Events                '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    fields_recommended: function (next) {
      console.log('======================================================');
      console.log(' Fields of Log Events.                        ');
      console.log('======================================================');
      console.log('\n');

      var fields_request = endpointAdvertiserReportEvents.getFields(
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
      console.log(' Count Log Events.                            ');
      console.log('======================================================');
      console.log('\n');
      var count_request = endpointAdvertiserReportEvents.count(
        start_date,
        end_date,
        null,                                           // filter
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
      console.log(' Find Log Events.                            ');
      console.log('======================================================');
      console.log('\n');
      var find_request = endpointAdvertiserReportEvents.find(
        start_date,
        end_date,
        fields_recommended,
        null,                                           // filter
        5,                                              // limit
        null,                                           // page
        { 'created': 'DESC' },                          // sort
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
      console.log(' Export Log Events CSV report.                            ');
      console.log('======================================================');
      console.log('\n');
      var export_request = endpointAdvertiserReportEvents.exportReport(
        start_date,
        end_date,
        fields_recommended,
        null,                                           // filter
        'csv',                                          // format
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

          csv_job_id = endpointAdvertiserReportEvents.parseResponseReportJobId(response);

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
      console.log(' Fetch Log Events CSV report.                         ');
      console.log('======================================================');
      console.log('\n');
      var fetch_request = endpointAdvertiserReportEvents.fetchReport(
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

          csv_report_url = endpointAdvertiserReportEvents.parseResponseReportUrl(response);

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
    exportJsonReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Export Log Events JSON report.                            ');
      console.log('======================================================');
      console.log('\n');
      var export_request = endpointAdvertiserReportEvents.exportReport(
        start_date,
        end_date,
        fields_recommended,
        null,                                           // filter
        'json',                                          // format
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

          json_job_id = endpointAdvertiserReportEvents.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= JSON Report Job ID: "%s"', json_job_id));
          next();
        }
      });

      export_request.once('error', function (response) {
        return next(response);
      });
    },
    fetchJsonReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Fetch Log Events JSON report.                         ');
      console.log('======================================================');
      console.log('\n');
      var fetch_request = endpointAdvertiserReportEvents.fetchReport(
        json_job_id,
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

          json_report_url = endpointAdvertiserReportEvents.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= JSON Report URL: "%s"', json_report_url));

          next();
        }
      });

      fetch_request.once('error', function (response) {
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