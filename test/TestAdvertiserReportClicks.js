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

require('../lib/helpers/Date');

var
  tune_reporting = require('../lib'),
  AdvertiserReportClicks = tune_reporting.api.AdvertiserReportClicks,
  EndpointBase = tune_reporting.base.endpoints.EndpointBase,
  expect = require('chai').expect;

describe('test AdvertiserReportClicks', function () {
  this.timeout(10000);
  var
    endpointAdvertiserReportClicks,
    api_key,
    csv_job_id,
    date = new Date(),
    yesterday = date.yesterdayDate(),
    start_date = date.startDateTime(yesterday),
    end_date = date.endDateTime(yesterday),
    response_timezone = 'America/Los_Angeles',
    fields_recommended = null;

  before(function () {
    api_key = process.env.API_KEY;
    endpointAdvertiserReportClicks = new AdvertiserReportClicks(
      api_key
    );
  });

  it('fields recommended', function (done) {
    var fields_request = endpointAdvertiserReportClicks.getFields(
      EndpointBase.TUNE_FIELDS_RECOMMENDED
    );
    fields_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result).to.be.a('array');
      fields_recommended = result;
      done();
    });

    fields_request.on('error', function (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('count', function (done) {
    var count_request = endpointAdvertiserReportClicks.count(
      start_date,
      end_date,
      null,                                           // filter
      response_timezone
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
    var find_request = endpointAdvertiserReportClicks.find(
      start_date,
      end_date,
      fields_recommended,
      null,                                           // filter
      5,                                              // limit
      null,                                           // page
      { 'created': 'DESC' },                          // sort
      response_timezone
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
    var export_request = endpointAdvertiserReportClicks.exportReport(
      start_date,
      end_date,
      fields_recommended,
      null,                                           // filter
      'csv',                                          // format
      response_timezone
    );
    export_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);

      csv_job_id = endpointAdvertiserReportClicks.parseResponseReportJobId(result);
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
    var status_request = endpointAdvertiserReportClicks.statusReport(
      csv_job_id
    );
    status_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      done();
    });

    status_request.on('error', function (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });
});