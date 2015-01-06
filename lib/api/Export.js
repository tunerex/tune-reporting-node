#!/usr/bin/env node
/**
 * Export.js, TUNE Reporting SDK class.
 *
 * @module tune-reporting
 * @submodule api
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

// Dependencies
var
  InvalidArgument = require('../helpers').InvalidArgument,
  TuneSdkError = require('../helpers').TuneSdkError,
  TuneServiceError = require('../helpers').TuneServiceError,
  _ = require('underscore'),
  util = require('util'),
  prettyjson = require('prettyjson'),
  EndpointBase = require('../base/endpoints').EndpointBase;

/**
 * TUNE Advertiser Report endpoint '/export/'.
 *
 * @class Export
 * @constructor
 * @extends EndpointBase
 */
function Export() {
  Export.super_.call(this, 'export', true);
}

util.inherits(Export, EndpointBase);

/**
 * Action 'download' for polling export queue for status information on
 * request report to be exported.
 *
 * @method download
 *
 * @param string jobId    Job identifier assigned for report export.
 * @param object callback Error-first Callback.
 *
 * @return object
 * @throws InvalidArgument
 */
Export.prototype.download = function (
  jobId,
  callback
) {
  if (!jobId
      || !_.isString(jobId)
      || (jobId.length === 0)
      ) {
    throw new InvalidArgument('Parameter "jobId" is not defined.');
  }

  var endpointRequest = this.getEndpointRequest('download');

  // Success event response
  endpointRequest.once('success', function onSuccess(response) {
    callback(null, response);
  });

  // Error event response
  endpointRequest.once('error', function onError(response) {
    callback(response, null);
  });
};

/**
 * Helper function for parsing export status response to gather report jobId.
 *
 * @method parseResponseReportJobId
 *
 * @param string response
 *
 * @return {String} Report job identifier within export queue.
 * @throws InvalidArgument
 * @throws TuneServiceError
 */
Export.prototype.parseResponseReportJobId = function (response) {
  if (!response) {
    throw new TuneServiceError("Parameter 'response' is not defined.");
  }
  var
    data = response.getData(),
    jobId;
  if (!data) {
    throw new TuneServiceError(
      util.format('Report request failed to get export data, response: "%s"', response.toString())
    );
  }

  jobId = data;
  if (!_.isString(jobId) || (0 === jobId.length)) {
    throw new TuneSdkError(
      util.format('Report request failed return "job_id": "%s"', response.toString())
    );
  }

  return jobId;
};

/**
 * Helper function for parsing export status response to gather report url.
 *
 * @method parseResponseReportUrl
 *
 * @param string response
 *
 * @return {String} Report URL for download.
 * @throws InvalidArgument
 * @throws TuneServiceError
 */
Export.prototype.parseResponseReportUrl = function (response) {
  if (!response) {
    throw new TuneServiceError("Parameter 'response' is not defined.");
  }
  var
    data = response.getData(),
    report_url;
  if (!data) {
    throw new TuneServiceError(
      util.format(
        'Report request failed to get export data, response: "%s"',
        response.toString()
      )
    );
  }

  if (!data.hasOwnProperty('data')) {
    throw new TuneServiceError(
      util.format(
        'Export data response does not contain "data": response: "%s"',
        prettyjson.render(data, {}, 2)
      )
    );
  }

  if (!data.data) {
    throw new TuneServiceError(
      util.format(
        'Export "data" is empty: response: "%s"',
        prettyjson.render(data, {}, 2)
      )
    );
  }

  if (!data.data.hasOwnProperty('url')) {
    throw new TuneServiceError(
      util.format(
        'Export "data" response does not contain "url": response "%s"',
        prettyjson.render(data.data, {}, 2)
      )
    );
  }

  report_url = data.data.url;
  if (!_.isString(report_url) || (0 === report_url.length)) {
    throw new TuneSdkError(
      util.format('Report request failed return report_url: "%s"', response.toString())
    );
  }
  return report_url;
};

module.exports = Export;