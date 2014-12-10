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
  client;

function conclude(status, response) {
  console.log('\n');
  console.log('= Status: "' + status + '"');
  console.log('= TuneManagementResponse:');
  console.log(response.toString());
}

try {
  var args = process.argv.slice(2);

  if (args.length !== 1) {
    throw new tune_reporting.helpers.InvalidArgument(null, 'api_key');
  }

  var
    api_key = args[0],
    client = new tune_reporting.base.service.TuneManagementClient(
      'account/users',
      'find',
      api_key,
      {
        'limit' : 5,
        'filter' : "(first_name LIKE '%a%')"
      }
    );

  async.series({
    start: function (next) {
      console.log('\n');
      console.log('======================================================'.blue.bold);
      console.log(' Begin: Tune Management API Client Account Users      '.blue.bold);
      console.log('======================================================'.blue.bold);
      console.log('\n');
      next();
    },
    request_via_callback: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Handle Tune API Client Request callback.             ');
      console.log('======================================================');

      var
        client_request = client.request(function (error, response) {
          if (error) {
            console.log('\n');
            console.log('= Callback: "error"');
            console.log(error);
            next(error);
          } else {
            console.log('\n');
            console.log('= Callback: "success"');
            console.log('= TuneManagementResponse:');
            console.log(response.toString());
            next();
          }
        });
    },
    request: function (next) {
      console.log('\n');
      console.log('======================================================');
      console.log(' Handle Tune API Client Request events.               ');
      console.log('======================================================');

      var
        client_request = client.request();

      client_request.on('success', function (response) {
        console.log('\n');
        console.log('= Event: "success"');
        console.log('= TuneManagementResponse:');
        console.log(response.toString());
        next();
      });

      client_request.on('error', function (response) {
        console.log('\n');
        console.log('= Event: "error"');
        console.log(response);
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