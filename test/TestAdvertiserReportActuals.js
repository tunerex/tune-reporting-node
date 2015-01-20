#!/usr/bin/env node
/**
 * TestAdvertiserReportActuals.js, Test of TUNE Reporting API.
 *
 * @module tune-reporting
 * @submodule test
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

require('../lib/helpers/Date');

var
  config = require('../config.js'),
  tuneReporting = require('../lib'),
  AdvertiserReportActuals = tuneReporting.api.AdvertiserReportActuals,
  EndpointBase = tuneReporting.base.endpoints.EndpointBase,
  SessionAuthenticate = tuneReporting.api.SessionAuthenticate,
  expect = require('chai').expect;

describe('test AdvertiserReportActuals', function () {
  this.timeout(60000);
  var
    advertiserReport,
    csvJobId,
    apiKey,

    // Set start date to the start of one week ago.
    startDate = new Date().setOneWeekAgo().setStartTime().getIsoDateTime(),
    endDate = new Date().setYesterday().setEndTime().getIsoDateTime(),

    strResponseTimezone = 'America/Los_Angeles',
    fieldsRecommended = null;

  before(function () {
    apiKey = process.env.API_KEY;
    config.set('tune.reporting.auth_key', apiKey);
    config.set('tune.reporting.auth_type', 'api_key');
    advertiserReport = new AdvertiserReportActuals();
  });

  it('fields all', function (done) {
    advertiserReport.getFields(
      EndpointBase.TUNE_FIELDS_ALL,
      function (error, response) {
        expect(error).to.be.null;
        expect(response).to.be.not.null;
        done();
      }
    );
  });

  it('fields recommended', function (done) {
    advertiserReport.getFields(
      EndpointBase.TUNE_FIELDS_RECOMMENDED,
      function (error, response) {
        expect(error).to.be.null;
        expect(response).to.be.not.null;
        fieldsRecommended = response;
        expect(fieldsRecommended).to.be.not.empty;
        done();
      }
    );
  });

  it('count', function (done) {
    advertiserReport.count(
      startDate,
      endDate,
      'site_id,publisher_id',                         // group
      '(publisher_id > 0)',                           // filter
      strResponseTimezone,
      function (error, response) {
        expect(error).to.be.null;
        expect(response).to.be.not.null;
        done();
      }
    );
  });

  it('find', function (done) {
    var options = {
      startDate: startDate,
      endDate: endDate,
      fields: fieldsRecommended,
      group: 'site_id,publisher_id',                         // group
      filter: '(publisher_id > 0)',                           // filter
      limit: 5,                                              // limit
      page: null,                                           // page
      sort: { 'paid_installs': 'DESC' },                    // sort
      timestamp: 'datehour',                                     // timestamp
      responseTimezone: strResponseTimezone,
    }

    advertiserReport.find(
      options,
      function (error, response) {
        expect(error).to.be.null;
        expect(response).to.be.not.null;
        done();
      }
    );
  });

  it('exportReport CSV', function (done) {
    advertiserReport.exportReport(
      startDate,
      endDate,
      fieldsRecommended,                              // fields
      'site_id,publisher_id',                         // group
      '(publisher_id > 0)',                           // filter
      'datehour',                                     // timestamp
      'csv',                                          // format
      strResponseTimezone,
      function (error, response) {
        expect(error).to.be.null;
        expect(response).to.be.not.null;

        csvJobId = response.toJson().responseJson.data;
        expect(csvJobId).to.be.not.null;
        expect(csvJobId).to.be.a('string');
        expect(csvJobId).to.be.not.empty;

        done();
      }
    );
  });

  it('statusCsvReport', function (done) {
    advertiserReport.statusReport(
      csvJobId,
      function (error, response) {
        expect(error).to.be.null;
        expect(response).to.be.not.null;
        done();
      }
    );
  });
});