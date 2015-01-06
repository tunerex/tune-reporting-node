#!/usr/bin/env node
/**
 * ExampleAdvertiserReportLogClicks.js, Example of TUNE Reporting API.
 *
 * @module examples
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-06 14:33:18 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

var
  config = require('../config.js'),
  tuneReporting = require('../lib'),
  _ = require('underscore'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  async = require('async'),
  AdvertiserReportLogClicks = tuneReporting.api.AdvertiserReportLogClicks,
  SessionAuthenticate = tuneReporting.api.SessionAuthenticate,
  EndpointBase = tuneReporting.base.endpoints.EndpointBase,
  ReportReaderCSV = tuneReporting.helpers.ReportReaderCSV,
  ReportReaderJSON = tuneReporting.helpers.ReportReaderJSON,
  response;

require('../lib/helpers/Date');

try {
  var
    apiKey = undefined,
    authKey = config.get('tune.reporting.auth_key'),
    authType = config.get('tune.reporting.auth_type'),
    sessionAuthenticate = new SessionAuthenticate(),
    sessionToken = undefined,
    advertiserReport = new AdvertiserReportLogClicks(),

    startDate = new Date().setYesterday().setStartTime().getIsoDateTime(),
    endDate = new Date().setYesterday().setEndTime().getIsoDateTime(),

    strResponseTimezone = 'America/Los_Angeles',
    arrayFieldsRecommended = null,
    csvJobId = null,
    csvReportUrl = null,
    jsonJobId = null,
    jsonReportUrl = null;

    if (!authKey || !_.isString(authKey) || (0 === authKey.length)) {
      throw new InvalidArgument(
        'authKey'
      );
    }
    if (!authType || !_.isString(authType) || (0 === authType.length)) {
      throw new InvalidArgument(
        'authType'
      );
    }
    apiKey = authKey;

  async.series({
    taskStartExample: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: TUNE Advertiser Report Log Clicks             '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    taskSessionToken: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Get Session Token.                                       ');
      console.log('==========================================================');
      console.log('\n');

      sessionAuthenticate.getSessionToken(apiKey, function (error, response) {
        if (error) {
          return next(error);
        }

        console.log(' Status: "success"');
        sessionToken = response.getData();
        console.log(' session_token:');
        console.log(sessionToken);
        return next();
      });
    },
    taskCount: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Count Advertiser Report Log Clicks.                      ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.count(
        startDate,
        endDate,
        null,                                           // filter
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
          console.log(response.toJson().response_json.data);

          console.log('\n');
          console.log(util.format(' Count: %d', count));
          return next();
        }
      );
    },
    taskCountSessionToken: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Count Advertiser Report Log Clicks session_token         ');
      console.log('==========================================================');
      console.log('\n');

      config.set('tune.reporting.auth_key', sessionToken);
      config.set('tune.reporting.auth_type', 'session_token');

      advertiserReport.count(
        startDate,
        endDate,
        null,                                           // filter
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
          console.log(response.toJson().response_json.data);

          console.log('\n');
          console.log(util.format(' Count: %d', count));
          return next();
        }
      );
    },
    taskFieldsRecommended: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Recommended Fields of Advertiser Report Log Clicks.      ');
      console.log('==========================================================');
      console.log('\n');

      config.set('tune.reporting.auth_key', apiKey);
      config.set('tune.reporting.auth_type', 'api_key');

      advertiserReport.getFields(
        EndpointBase.TUNE_FIELDS_RECOMMENDED,
        function (error, response) {
          if (error) {
            return next(error);
          }

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response);
          arrayFieldsRecommended = response;
          return next();
        }
      );
    },
    taskFind: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Find Advertiser Report Log Clicks.                       ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.find(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        null,                                           // filter
        5,                                              // limit
        null,                                           // page
        { 'created': 'DESC' },                          // sort
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
          console.log(response.toJson().response_json.data);
          return next();
        }
      );
    },
    taskExportCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Log Clicks CSV report.          ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        null,                                           // filter
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
          console.log(response.toJson().response_json.data);

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
      console.log(' Status Advertiser Report Log Clicks CSV report.          ');
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
      console.log(' Fetch Advertiser Report Log Clicks CSV report.           ');
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
          console.log(response.toJson().response_json.data);

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
      console.log(' Read Advertiser Report Log Clicks CSV report.            ');
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
      console.log(' Export Advertiser Report Log Clicks JSON report.         ');
      console.log('==========================================================');
      console.log('\n');

      advertiserReport.exportReport(
        startDate,
        endDate,
        arrayFieldsRecommended,                         // fields
        null,                                           // filter
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
          console.log(response.toJson().response_json.data);

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
      console.log(' Status Advertiser Report Log Clicks JSON report.          ');
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
      console.log(' Fetch Advertiser Report Log Clicks JSON report.           ');
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
          console.log(response.toJson().response_json.data);

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
      console.log(' Read Advertiser Report Log Clicks JSON report.           ');
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