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
  AdvertiserReportCohort = tune_reporting.api.AdvertiserReportCohort,
  EndpointBase = tune_reporting.base.endpoints.EndpointBase,
  expect = require('chai').expect;

describe('test AdvertiserReportCohort', function () {
  this.timeout(30000);
  var
    endpointAdvertiserReportCohort,
    api_key,
    csv_job_id,

    // Set start date to the start of one week ago.
    dateWeekAgo = new Date(),
    week_ago = dateWeekAgo.oneWeekAgoDate(),
    start_date = dateWeekAgo.startDateTime(week_ago),

    // Set end date to end of yesterday.
    date_yesterday = new Date(),
    yesterday = date_yesterday.yesterdayDate(),
    end_date = date_yesterday.endDateTime(yesterday),

    response_timezone = 'America/Los_Angeles',
    fields_recommended = null;

  before(function () {
    api_key = process.env.API_KEY;
    endpointAdvertiserReportCohort = new AdvertiserReportCohort(
      api_key
    );
  });

  it('fields recommended', function (done) {
    var fields_request = endpointAdvertiserReportCohort.getFields(
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
    var count_request = endpointAdvertiserReportCohort.count(
      start_date,
      end_date,
      'click',                                        // cohort_type
      'year_day',                                     // cohort_interval
      'site_id,publisher_id',                         // group
      '(publisher_id > 0)',                           // filter
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
    var find_request = endpointAdvertiserReportCohort.find(
      start_date,
      end_date,
      'click',                                        // cohort_type
      'year_day',                                     // cohort_interval
      'cumulative',                                   // aggregation_type
      fields_recommended,                             // fields
      'site_id,publisher_id',                         // group
      '(publisher_id > 0)',                           // filter
      5,                                              // limit
      null,                                           // page
      null,                                           // sort
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
    var export_request = endpointAdvertiserReportCohort.exportReport(
      start_date,
      end_date,
      'click',                                        // cohort_type
      'year_day',                                     // cohort_interval
      'cumulative',                                   // aggregation_type
      fields_recommended,                             // fields
      'site_id,publisher_id',                         // group
      '(publisher_id > 0)',                           // filter
      response_timezone
    );
    export_request.on('success', function (result) {
      expect(result).to.be.not.null;
      expect(result.getData()).to.be.not.null;
      expect(result.getErrors()).to.be.null;
      expect(result.getHttpCode()).eql(200);

      csv_job_id = endpointAdvertiserReportCohort.parseResponseReportJobId(result);
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
    var status_request = endpointAdvertiserReportCohort.statusReport(
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