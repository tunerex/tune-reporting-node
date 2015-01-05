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
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-05 10:18:08 $
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
  var
    advertiserReport = new AdvertiserReportActuals(),

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
      console.log(' Begin: TUNE Advertiser Report Actuals                '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    taskDefine: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Define Metadata of Advertiser Report Click Logs.         ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.getDefine(function (error, response) {
        if (error) {
          return next(error);
        }

        console.log('\n');
        console.log(' Status: "success"');
        console.log(' TuneManagementResponse:');
        console.log(response);
        console.log(' JSON:');
        console.log(response.toJson());
        return next();
      });
    },
    taskFieldsRecommended: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Recommended Fields of Advertiser Report Actuals          ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.getFields(
        EndpointBase.TUNE_FIELDS_RECOMMENDED,
        function (error, response) {
          if (error) {
            return next(error);
          }

          console.log('\n');
          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response);
          console.log(' JSON:');
          console.log(response.toJson());
          arrayFieldsRecommended = response;
          return next();
        }
      );
    },
    taskCount: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Count Advertiser Report Actuals                          ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.count(
        startDate,
        endDate,
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

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response.toJson());

          console.log('\n');
          console.log(util.format(' Count: %d', count));
          return next();
        }
      );
    },
    taskFindFilter1: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Actuals with Filter #1.           ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.find(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        5,                                              // limit
        null,                                           // page
        { 'paid_installs': 'DESC' },                    // sort
        'datehour',                                     // timestamp
        strResponseTimezone,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response);
          console.log(' JSON:');
          console.log(response.toJson());
          return next();
        }
      );
    },
    taskFindFilter2: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Actuals with Filter #2.           ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.find(
        startDate,
        endDate,
        arrayFieldsRecommended,                             // fields
        'site_id,publisher_id',                             // group
        '(ad_network_id = 938) AND (publisher_id = 877)',   // filter
        5,                                                  // limit
        null,                                               // page
        { 'paid_installs': 'DESC' },                        // sort
        'datehour',                                         // timestamp
        strResponseTimezone,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response);
          console.log(' JSON:');
          console.log(response.toJson());
          return next();
        }
      );
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
        ];

      advertiserReport.find(
        startDate,
        endDate,
        fields,                                                         // fields
        'site_id,publisher_id',                                         // group
        "(publisher_id > 0) AND (publisher.name = 'App Alliances')",    // filter
        5,                                                              // limit
        null,                                                           // page
        { 'installs': 'DESC' },                                         // sort
        'datehour',                                                     // timestamp
        'UTC',                                                          // response_timezone
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response.toJson());
          return next();
        }
      );
    },
    taskExportCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Actuals CSV report.         ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        'datehour',                                     // timestamp
        'csv',                                          // format
        strResponseTimezone,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response);
          console.log(' JSON:');
          console.log(response.toJson());

          csvJobId = advertiserReport.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format(' CSV Report Job ID: "%s"', csvJobId));
          return next();
        }
      );
    },
    taskStatusCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Status Advertiser Report Actuals Logs CSV report.          ');
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

          console.log(' Status: "success"');
          var json = response.toJson();
          console.log(json.response_json.data);

          return next();
        }
      );
    },
    taskFetchCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Fetch Advertiser Report Actuals CSV report.          ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.fetchReport(
        csvJobId,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response);
          console.log(' JSON:');
          console.log(response.toJson());

          csvReportUrl = advertiserReport.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format(' CSV Report URL: "%s"', csvReportUrl));

          return next();
        }
      );
    },
    taskReadCsvReport: function (next) {

      console.log('\n');
      console.log('==========================================================');
      console.log(' Read Advertiser Report Actuals CSV report.           ');
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
    taskExportJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Actuals JSON report.        ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        'site_id,publisher_id',                         // group
        '(publisher_id > 0)',                           // filter
        'datehour',                                     // timestamp
        'json',                                         // format
        strResponseTimezone,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response.toJson());

          jsonJobId = advertiserReport.parseResponseReportJobId(response);

          console.log('\n');
          console.log(util.format(' JSON Report Job ID: "%s"', jsonJobId));
          return next();
        }
      );
    },
    taskStatusJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Status Advertiser Report Actuals Logs JSON report.          ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.statusReport(
        jsonJobId,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }

          console.log(' Status: "success"');
          var json = response.toJson();
          console.log(json.response_json.data);
          return next();
        }
      );
    },
    taskFetchJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Fetch Advertiser Report Actuals JSON report.         ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.fetchReport(
        jsonJobId,
        function (error, response) {
          if (error) {
            return next(error);
          }

          if ((response.getHttpCode() !== 200) || (response.getErrors() !== null)) {
            return next(response);
          }
          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response.toJson());

          jsonReportUrl = advertiserReport.parseResponseReportUrl(response);

          console.log('\n');
          console.log(util.format(' JSON Report URL: "%s"', jsonReportUrl));

          return next();
        }
      );
    },
    taskReadJsonReport: function (next) {

      console.log('\n');
      console.log('==========================================================');
      console.log(' Read Advertiser Report Actuals JSON report.          ');
      console.log('==========================================================');
      console.log('\n');
      var
        json_reader = new ReportReaderJSON(jsonReportUrl),
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
        console.log(' Status: "error"'.red);
        console.log(' TuneManagementResponse:'.red);
        console.log(err);
        console.log('======================================================'.red);
      }
    });
} catch (err) {
  console.log('\n');
  console.log('======================================================'.red);
  console.log(' Exception: "error"'.red);
  console.log(err);
  console.log(stackTrace.parse(err));
  console.log('======================================================'.red);
}