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
  request = require('request'),
  AccountUsers = tune_reporting.api.AccountUsers,
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
    endpointAccountUsers = new AccountUsers(
      api_key,
      true
    ),
    fields,
    csv_job_id,
    csv_report_url,
    json_job_id,
    json_report_url;

  async.series({
    start: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: Tune Management API Account Users             '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    fields: function (next) {
      console.log('======================================================');
      console.log(' Fields of Account Users records.               ');
      console.log('======================================================');
      console.log('\n');

      var fields_request = endpointAccountUsers.getFields(EndpointBase.TUNE_FIELDS_DEFAULT);
      fields_request.once('success', function (response) {
        fields = response;
        console.log('\n');
        console.log('= Status: "success"');
        console.log('= TuneManagementResponse:');
        console.log(fields);
        next();
      });

      fields_request.once('error', function (response) {
        return next(response);
      });

    },
    count: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Count Account Users records.                   ');
      console.log('======================================================');
      console.log('\n');

      var count_request = endpointAccountUsers.count(
        "(first_name LIKE '%a%')" // filter
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
      console.log(' Find Account Users records.                   ');
      console.log('======================================================');
      console.log('\n');
      var find_request = endpointAccountUsers.find(
        'id,created,first_name,last_name,name,email',   // fields
        "(first_name LIKE '%a%')",                      // filter
        5,                                              // limit
        null,                                           // page
        { 'created': 'DESC' }                           // sort
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
      console.log(' Export Account Users CSV report.               ');
      console.log('======================================================');
      console.log('\n');
      var export_request = endpointAccountUsers.exportReport(
        'id,created,first_name,last_name,name,email',   // fields
        "(first_name LIKE '%a%')",                      // filter
        'csv'                                           // format
      );

      export_request.once('success', function (response) {

        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          csv_job_id = endpointAccountUsers.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= CSV Report Job ID: "%s"', csv_job_id));
          next();
        }
      });

      export_request.once('error', function (response) {
        return next(response);
      });

    },
    statusCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Status Account Users CSV report.               ');
      console.log('======================================================');
      console.log('\n');

      var status_request = endpointAccountUsers.statusReport(
        csv_job_id
      );

      status_request.once('success', function (response) {

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

      status_request.once('error', function (response) {
        return next(response);
      });
    },
    fetchCsvReport: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Fetch Account Users CSV report.               ');
      console.log('======================================================');
      console.log('\n');

      var fetch_request = endpointAccountUsers.fetchReport(
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

          csv_report_url = endpointAccountUsers.parseResponseReportUrl(response);

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
      console.log(' Read Account Users CSV report.              ');
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
      console.log(' Export Account Users JSON report.               ');
      console.log('======================================================');
      console.log('\n');
      var export_request = endpointAccountUsers.exportReport(
        'id,created,first_name,last_name,name,email',   // fields
        "(first_name LIKE '%a%')",                      // filter
        'json'                                          // format
      );

      export_request.once('success', function (response) {

        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          next(response);
        } else {

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toString());

          json_job_id = endpointAccountUsers.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= CSV Report Job ID: "%s"', json_job_id));
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
      console.log(' Fetch Account Users JSON report.              ');
      console.log('======================================================');
      console.log('\n');

      var fetch_request = endpointAccountUsers.fetchReport(
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

          json_report_url = endpointAccountUsers.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= CSV Report URL: "%s"', json_report_url));

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
      console.log(' Read Account Users JSON report.              ');
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
    end: function (next) {
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
        console.log('= Status: "error"'.red);
        console.log(err);
      }
    });
} catch (err) {
  console.log(err);
  console.log(stackTrace.parse(err));
}