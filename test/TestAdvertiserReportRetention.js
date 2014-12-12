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
 * @version   $Date: 2014-12-12 11:53:57 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

require('../lib/helpers/Date');

var
  tuneReporting = require('../lib'),
  AdvertiserReportRetention = tuneReporting.api.AdvertiserReportRetention,
  EndpointBase = tuneReporting.base.endpoints.EndpointBase,
  expect = require('chai').expect;

describe('test AdvertiserReportRetention', function () {
  this.timeout(30000);
  var
    endpointAdvertiserReportRetention,
    apiKey,
    csvJobId,

    // Set start date to the start of one week ago.
    startDate = new Date().setOneWeekAgo().setStartTime().getIsoDateTime(),
    endDate = new Date().setYesterday().setEndTime().getIsoDateTime(),

    strResponseTimezone = 'America/Los_Angeles',
    fieldsRecommended = null;

  before(function () {
    apiKey = process.env.API_KEY;
    endpointAdvertiserReportRetention = new AdvertiserReportRetention(
      apiKey
    );
  });

  it('fields recommended', function (done) {
    var fields_request = endpointAdvertiserReportRetention.getFields(
      EndpointBase.TUNE_FIELDS_RECOMMENDED
    );
    fields_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result).to.be.a('array');
      fieldsRecommended = result;
      done();
    });

    fields_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('count', function (done) {
    var count_request = endpointAdvertiserReportRetention.count(
      startDate,
      endDate,
      'click',                                        // cohortType
      'year_day',                                     // cohortInterval
      'site_id,install_publisher_id',                 // group
      '(install_publisher_id > 0)',                   // filter
      strResponseTimezone
    );
    count_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      var count = result.getData();
      expect(count).least(0);
      done();
    });

    count_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('find', function (done) {
    var find_request = endpointAdvertiserReportRetention.find(
      startDate,
      endDate,
      'click',                                        // cohortType
      'year_day',                                     // cohortInterval
      fieldsRecommended,                             // fields
      'site_id,install_publisher_id',                 // group
      '(install_publisher_id > 0)',                   // filter
      5,                                              // limit
      null,                                           // page
      null,                                           // sort
      strResponseTimezone
    );
    find_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      done();
    });

    find_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('exportCsvReport', function (done) {
    var export_request = endpointAdvertiserReportRetention.exportReport(
      startDate,
      endDate,
      'click',                                        // cohortType
      'year_day',                                     // cohortInterval
      fieldsRecommended,                             // fields
      'site_id,install_publisher_id',                 // group
      '(install_publisher_id > 0)',                   // filter
      strResponseTimezone
    );
    export_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);

      csvJobId = endpointAdvertiserReportRetention.parseResponseReportJobId(result);
      expect(csvJobId).to.be.a('string');
      expect(csvJobId).to.be.not.empty;
      done();
    });

    export_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  it('statusCsvReport', function (done) {
    var status_request = endpointAdvertiserReportRetention.statusReport(
      csvJobId
    );
    status_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);
      done();
    });

    status_request.on('error', function onError (error) {
      expect(error).to.be.not.null;
      done(error);
    });
  });

  //it('fetchCsvReport', function (done) {
  //  var status_request = endpointAdvertiserReportRetention.fetchReport(
  //    csvJobId
  //  );
  //  status_request.on('success', function onSuccess (result) {
  //    expect(result).to.be.not.null;
  //    expect(result.getData()).to.be.not.null;
  //    expect(result.getErrors()).to.be.null;
  //    expect(result.getHttpCode()).eql(200);
  //
  //    var csvReportUrl
  //      = endpointAdvertiserReportRetention.parseResponseReportUrl(result);
  //    expect(csvReportUrl).to.be.not.null;
  //    expect(csvReportUrl).to.be.a('string');
  //    expect(csvReportUrl).to.be.not.empty;
  //    done();
  //  });
  //
  //  status_request.on('error', function onError (error) {
  //    expect(error).to.be.not.null;
  //    done(error);
  //  });
  //});
});