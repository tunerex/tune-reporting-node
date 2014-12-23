#!/usr/bin/env node
/**
 * ExampleAdvertiserReportActuals.js, Example of TUNE Reporting API.
 *
 * @module examples
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-23 07:55:28 $
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
  AdvertiserReportActuals = tuneReporting.api.AdvertiserReportActuals,
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
    advertiserReportActuals = new AdvertiserReportActuals(
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
      console.log(' Begin: TUNE Advertiser Report Actuals                '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    taskFieldsRecommended: function (next) {
      console.log('==========================================================');
      console.log(' Recommended Fields of Advertiser Report Actuals.     ');
      console.log('==========================================================');
      console.log('\n');

      var fields_request = advertiserReportActuals.getFields(
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
      console.log(' Count Advertiser Report Actuals.                     ');
      console.log('==========================================================');
      console.log('\n');
      var count_request = advertiserReportActuals.count(
        startDate,
        endDate,
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
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
    taskFindFilter1: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Actuals with Filter #1.           ');
      console.log('==========================================================');
      console.log('\n');
      var find_request = advertiserReportActuals.find(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        5,                                              // limit
        null,                                           // page
        { 'paid_installs': 'DESC' },                    // sort
        'datehour',                                     // timestamp
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
    taskFindFilter2: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Actuals with Filter #2.           ');
      console.log('==========================================================');
      console.log('\n');
      var find_request = advertiserReportActuals.find(
        startDate,
        endDate,
        arrayFieldsRecommended,                             // fields
        'site_id,publisher_id',                             // group
        '(ad_network_id = 938) AND (publisher_id = 877)',   // filter
        5,                                                  // limit
        null,                                               // page
        { 'paid_installs': 'DESC' },                        // sort
        'datehour',                                         // timestamp
        strResponseTimezone
      );
      find_request.once('success', function onSuccess(response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          console.log('======================================================'.red);
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
        console.log('======================================================'.red);
        return next(response);
      });
    },
    taskFindFilter3: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Actuals with Filter #3.           ');
      console.log('==========================================================');
      console.log('\n');
      var
        fields = [
          'site_id',
          'site.name',
          'publisher_id',
          'publisher.name',
          'publisher_sub_campaign_id',
          'publisher_sub_campaign.name',
          'ad_clicks_unique,installs',
          'events',
          'payouts',
          'revenues_usd',
          'publisher_sub_campaign.ref'
        ],
        find_request = advertiserReportActuals.find(
          startDate,
          endDate,
          fields,                                                         // fields
          'site_id,publisher_id',                                         // group
          "(publisher_id > 0) AND (publisher.name = 'App Alliances')",    // filter
          5,                                                              // limit
          null,                                                           // page
          { 'installs': 'DESC' },                                         // sort
          'datehour',                                                     // timestamp
          'UTC'                                                           // response_timezone
        );
      find_request.once('success', function onSuccess(response) {
        if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
          console.log('======================================================'.red);
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
        console.log('======================================================'.red);
        return next(response);
      });
    },
    taskExportCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Actuals CSV report.         ');
      console.log('==========================================================');
      console.log('\n');
      var export_request = advertiserReportActuals.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        'datehour',                                     // timestamp
        'csv',                                          // format
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

          csvJobId = advertiserReportActuals.parseResponseReportJobId(response);

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
      console.log(' Fetch Advertiser Report Actuals CSV report.          ');
      console.log('==========================================================');
      console.log('\n');
      var fetch_request = advertiserReportActuals.fetchReport(
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

          csv_report_url = advertiserReportActuals.parseResponseReportUrl(response);

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
      console.log(' Read Advertiser Report Actuals CSV report.           ');
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
    taskExportJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Actuals JSON report.        ');
      console.log('==========================================================');
      console.log('\n');
      var export_request = advertiserReportActuals.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        'datehour',                                     // timestamp
        'json',                                         // format
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

          json_job_id = advertiserReportActuals.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= JSON Report Job ID: "%s"', json_job_id));
          next();
        }
      });

      export_request.once('error', function onError(response) {
        return next(response);
      });
    },
    taskFetchJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Fetch Advertiser Report Actuals JSON report.         ');
      console.log('==========================================================');
      console.log('\n');
      var fetch_request = advertiserReportActuals.fetchReport(
        json_job_id,
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

          json_report_url = advertiserReportActuals.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= JSON Report URL: "%s"', json_report_url));

          next();
        }
      });

      fetch_request.once('error', function onError(response) {
        return next(response);
      });
    },
    taskReadJsonReport: function (next) {

      console.log('\n');
      console.log('==========================================================');
      console.log(' Read Advertiser Report Actuals JSON report.          ');
      console.log('==========================================================');
      console.log('\n');
      var
        json_reader = new ReportReaderJSON(json_report_url),
        print_request = json_reader.prettyprint(5);

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
      console.log('======================================================'.green.bold);
      console.log(' End Example                                          '.green.bold);
      console.log('======================================================'.green.bold);
      console.log('\n');
      next();
    }
  },
    function (err) {
      if (err) {
        console.log('\n');
        console.log('======================================================'.red);
        console.log('= Status: "error"'.red);
        console.log('= TuneManagementResponse:'.red);
        console.log('======================================================'.red);
        console.log(err);
      }
    });
} catch (err) {
  console.log('\n');
  console.log('======================================================'.red);
  console.log('= Exception: "error"'.red);
  console.log(err);
  console.log(stackTrace.parse(err));
  console.log('======================================================'.red);
}