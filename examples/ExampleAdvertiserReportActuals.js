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
 * @version   $Date: 2015-01-07 18:08:35 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

var
  config = require('../config.js'),
  tuneReporting = require('../lib'),
  _ = require('lodash'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  async = require('async'),
  AdvertiserReportActuals = tuneReporting.api.AdvertiserReportActuals,
  SessionAuthenticate = tuneReporting.api.SessionAuthenticate,
  EndpointBase = tuneReporting.base.endpoints.EndpointBase,
  InvalidArgument = tuneReporting.helpers.InvalidArgument,
  ReportReaderCSV = tuneReporting.helpers.ReportReaderCSV,
  ReportReaderJSON = tuneReporting.helpers.ReportReaderJSON,
  response;

require('../lib/helpers/Date');

try {
  var
    apiKey,
    authKey = config.get('tune.reporting.auth_key'),
    authType = config.get('tune.reporting.auth_type'),
    sessionAuthenticate = new SessionAuthenticate(),
    sessionToken,
    advertiserReport = new AdvertiserReportActuals(),

    startDate = new Date().setOneWeekAgo().setStartTime().getIsoDateTime(),
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
      console.log(' Begin: TUNE Advertiser Report Actuals                '.blue.bold);
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

          console.log(' Status: "success"');
          console.log(' TuneManagementResponse:');
          console.log(response);
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
          console.log(response.toJson().responseJson.data);

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
          console.log(response.toJson().responseJson.data);
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
          console.log(response.toJson().responseJson.data);
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
          console.log(response.toJson().responseJson.data);
          return next();
        }
      );
    },
    taskExportCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Actuals CSV report.             ');
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
          console.log(response.toJson().responseJson.data);

          csvJobId = response.toJson().responseJson.data;

          console.log('\n');
          console.log(util.format(' CSV Report Job ID: "%s"', csvJobId));
          return next();
        }
      );
    },
    taskStatusCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Status Advertiser Report Actuals Logs CSV report.        ');
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
          console.log(json.responseJson.data);

          return next();
        }
      );
    },
    taskFetchCsvReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Fetch Advertiser Report Actuals CSV report.              ');
      console.log('==========================================================');
      console.log('\n');

      csvReportUrl = undefined;

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
          console.log(response.toJson().responseJson.data);

          if (100 === response.toJson().responseJson.data.percent_complete) {
            csvReportUrl = advertiserReport.parseResponseReportUrl(response);

            console.log(util.format(' CSV Report URL: "%s"', csvReportUrl));
          } else {
            console.log(' Fetch CSV Report not completed:');
            console.log(response.toJson().responseJson.data);
          }

          return next();
        }
      );
    },
    taskReadCsvReport: function (next) {

      console.log('\n');
      console.log('==========================================================');
      console.log(' Read Advertiser Report Actuals CSV report.               ');
      console.log('==========================================================');
      console.log('\n');

      if (csvReportUrl) {
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
      } else {
        console.log(' Failed to fetch CSV Report URL.');
      }
    },
    taskExportJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Export Advertiser Report Actuals JSON report.            ');
      console.log('==========================================================');
      console.log('\n');

      jsonJobId = undefined;

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
          console.log(response.toJson().responseJson.data);

          jsonJobId = response.toJson().responseJson.data;

          console.log('\n');
          console.log(util.format(' JSON Report Job ID: "%s"', jsonJobId));
          return next();
        }
      );
    },
    taskStatusJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Status Advertiser Report Actuals Logs JSON report.       ');
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
          console.log(json.responseJson.data);
          return next();
        }
      );
    },
    taskFetchJsonReport: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Fetch Advertiser Report Actuals JSON report.             ');
      console.log('==========================================================');
      console.log('\n');

      jsonReportUrl = undefined;

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
          console.log(response.toJson().responseJson.data);

          if (100 === response.toJson().responseJson.data.percent_complete) {
            jsonReportUrl = advertiserReport.parseResponseReportUrl(response);

            console.log(util.format(' JSON Report URL: "%s"', jsonReportUrl));
          } else {
            console.log(' Fetch JSON Report not completed:');
            console.log(response.toJson().responseJson.data);
          }

          return next();
        }
      );
    },
    taskReadJsonReport: function (next) {

      console.log('\n');
      console.log('==========================================================');
      console.log(' Read Advertiser Report Actuals JSON report.              ');
      console.log('==========================================================');
      console.log('\n');

      if (jsonReportUrl) {
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
      } else {
        console.log(' Failed to fetch JSON Report URL.');
      }

    },
    taskCountSessionToken: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Count Advertiser Report Actuals session_token            ');
      console.log('==========================================================');
      console.log('\n');

      config.set('tune.reporting.auth_key', sessionToken);
      config.set('tune.reporting.auth_type', 'session_token');

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