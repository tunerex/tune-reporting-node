#!/usr/bin/env node
/**
 * ExampleAdvertiserReportCohortValue.js, Example of TUNE Reporting API.
 *
 * @module examples
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-23 15:54:36 $
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
  AdvertiserReportCohortValue = tuneReporting.api.AdvertiserReportCohortValue,
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
    advertiserReport = new AdvertiserReportCohortValue(
      apiKey,
      true
    ),

    startDate = new Date().setOneWeekAgo().setStartTime().getIsoDateTime(),
    endDate = new Date().setYesterday().setEndTime().getIsoDateTime(),

    strResponseTimezone = 'America/Los_Angeles',
    arrayFieldsRecommended = null,
    csvJobId = null,
    csvReportUrl = null,
    jsonJobId = null,
    jsonReportUrl = null;

  async.series({
    taskStartExample: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: TUNE Advertiser Report Cohort Value           '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    taskDefine: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Define Metadata of Advertiser Report Cohort Value       ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.getDefine(function (error, response) {
        if (error) {
          return next(error);
        }

        console.log('\n');
        console.log('= Status: "success"');
        console.log('= TuneManagementResponse:');
        console.log(response);
        return next();
      });
    },
    taskFieldsRecommended: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Recommended Fields of Advertiser Report Cohort Value.    ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.getFields(
        EndpointBase.TUNE_FIELDS_RECOMMENDED,
        function (error, response) {
          if (error) {
            return next(error);
          }

          console.log('\n');
          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response);
          arrayFieldsRecommended = response;
          return next();
        }
      );
    },
    taskCount: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Count Advertiser Report Cohort Value                     ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.count(
        startDate,
        endDate,
        'click',                                        // cohortType
        'year_day',                                     // cohortInterval
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        strResponseTimezone,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          var count = response.getData();

          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toJson());

          console.log('\n');
          console.log(util.format('= Count: %d', count));
          return next();
        }
      );

    },
    taskFind: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Cohort Value                      ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.find(
        startDate,
        endDate,
        'click',                                        // cohortType
        'year_day',                                     // cohortInterval
        'cumulative',                                   // aggregationType
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        5,                                              // limit
        null,                                           // page
        null,                                           // sort
        strResponseTimezone,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toJson());
          return next();
        }
      );
    },
    taskExportCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Cohort Value CSV report.        ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.exportReport(
        startDate,
        endDate,
        'click',                                        // cohortType
        'year_day',                                     // cohortInterval
        'cumulative',                                   // aggregationType
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        strResponseTimezone,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toJson());

          csvJobId = advertiserReport.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format('= CSV Report Job ID: "%s"', csvJobId));
          return next();
        }
      );
    },
    taskStatusCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Status Advertiser Report Cohort Value CSV report.          ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.statusReport(
        csvJobId,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log('= Status: "success"');
          var json = response.toJson();
          console.log(json.response_json.data);

          return next();
        }
      );
    },
    taskFetchCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Fetch Advertiser Report Cohort Value CSV report.         ');
      console.log('==========================================================');
      console.log('\n');
      advertiserReport.fetchReport(
        csvJobId,
        true,                                 // verbose
        10,                                   // sleep
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log('= Status: "success"');
          console.log('= TuneManagementResponse:');
          console.log(response.toJson());

          csvReportUrl = advertiserReport.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format('= CSV Report URL: "%s"', csvReportUrl));

          return next();
        }
      );
    },
    taskReadCsvReport: function (next) {

      console.log('\n');
      console.log('==========================================================');
      console.log(' Read Advertiser Report Cohort Value CSV report.          ');
      console.log('==========================================================');
      console.log('\n');
      var
        csv_reader = new ReportReaderCSV(csvReportUrl),
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