#!/usr/bin/env node
// define global objects:
/*global describe, before, it*/

// define jslint-options:
/* jshint -W030 -W036 */

/**
 * Tests of Tune Reporting API
 *
 * @module tune-reporting
 * @submodule test
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
  AccountUsers = tune_reporting.api.AccountUsers,
  expect = require('chai').expect;

describe('test AccountUsers', function () {
  this.timeout(10000);
  var
    endpointAccountUsers,
    api_key,
    csv_job_id;

  before(function () {
    api_key = process.env.API_KEY;
    endpointAccountUsers = new AccountUsers(
      api_key
    );
  });

  it('count', function (done) {
    var count_request = endpointAccountUsers.count(
      "(first_name LIKE '%a%')" // filter
    );
    count_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      var count = result.getData();
      expect(count).least(0);
      done();
    });

    count_request.on('error', function (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('find', function (done) {
    var find_request = endpointAccountUsers.find(
      'id,created,first_name,last_name,name,email',   // fields
      "(first_name LIKE '%a%')",                      // filter
      5,                                              // limit
      null,                                           // page
      { 'created': 'DESC' }                           // sort
    );
    find_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      done();
    });

    find_request.on('error', function (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('exportCsvReport', function (done) {
    var export_request = endpointAccountUsers.exportReport(
      'id,created,first_name,last_name,name,email',   // fields
      "(first_name LIKE '%a%')",                      // filter
      'csv'                                           // format
    );
    export_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);

      csv_job_id = endpointAccountUsers.parseResponseReportJobId(result);
      expect(csv_job_id).to.be.a('string');
      expect(csv_job_id).to.be.not.empty;
      done();
    });

    export_request.on('error', function (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('statusCsvReport', function (done) {
    var status_request = endpointAccountUsers.statusReport(
      csv_job_id
    );
    status_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result.getRequestUrl()).to.be.not.null;
      expect(result.getRequestUrl()).to.be.a('string');
      expect(result.getRequestUrl()).to.be.not.empty;
      expect(result.getData()).to.be.not.null;
      done();
    });

    status_request.on('error', function (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });
});