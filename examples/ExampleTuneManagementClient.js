#!/usr/bin/env node
/**
 * Examples of TUNE Reporting API
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
  config = require('../config.js'),
  tuneReporting = require('../lib'),
  _ = require('underscore'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  client;

function conclude(status, response) {
  console.log('\n');
  console.log(' Status: "' + status + '"');
  console.log(' TuneManagementResponse:');
  console.log(response.toString());
}

try {
  var
    apiKey = config.get('tune.reporting.api_key'),
    client = new tuneReporting.base.service.TuneManagementClient(
      'account/users',
      'find',
      apiKey,
      {
        'limit' : 5,
        'filter' : "(first_name LIKE '%a%')"
      }
    );

  async.series({
    start: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: TUNE Management API Client                    '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    request_via_callback: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Handle TUNE Reporting API Client Request callback.       ');
      console.log('==========================================================');

      var
        client_request = client.request(function (error, response) {
          if (error) {
            console.log('\n');
            console.log(' Callback: "error"');
            console.log(error);
            next(error);
          } else {
            console.log('\n');
            console.log(' Callback: "success"');
            console.log(' TuneManagementResponse:');
            console.log(response);
            console.log(' JSON:');
            console.log(response.toJson());
            next();
          }
        });
    },
    request: function (next) {
      console.log('\n');
      console.log('==========================================================');
      console.log(' Handle TUNE Reporting API Client Request events.         ');
      console.log('==========================================================');

      var
        client_request = client.request();

      client_request.on('success', function onSuccess(response) {
        console.log('\n');
        console.log(' Event: "success"');
        console.log(' TuneManagementResponse:');
        console.log(response);
        console.log(' JSON:');
        console.log(response.toJson());
        next();
      });

      client_request.on('error', function onError(response) {
        console.log('\n');
        console.log(' Event: "error"');
        console.log(response);
        return next(response);
      });
    },
    end: function (next) {
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
        console.log(' Status: "error"'.red);
        console.log(' TuneManagementResponse:');
        console.log(err);
      }
    });

} catch (err) {

  console.log('\n');
  console.log(' Exception: "error"'.red);
  console.log(err);
  console.log(stackTrace.parse(err));
}