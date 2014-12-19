#!/usr/bin/env node
/**
 * Classes that define TUNE Advertiser Report service access.
 *
 * @module base
 * @submodule service
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-18 17:16:13 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

// Dependencies
var helpers = require('../../helpers'),
  _ = require('underscore'),
  prettyjson = require('prettyjson'),
  util = require('util');

/**
 * TUNE MobileAppTracking Management API full service response.
 *
 * @class TuneManagementResponse
 * @constructor
 *
 * @param string requestUrl           TUNE Advertiser Report request URL.
 * @param string response_json         TUNE Advertiser Report Service full
 *                                    response.
 * @param array  response_headers      TUNE Advertiser Report Service
 *                                    response HTTP headers.
 * @param string response_http_code    TUNE Advertiser Report Service response
 *                                    HTTP code.
 */
function TuneManagementResponse(
  requestUrl,
  response_json,
  response_headers,
  response_http_code
) {
  this.requestUrl = requestUrl;
  this.response_json = response_json;
  this.response_headers = response_headers;
  this.response_http_code = response_http_code;
}

/**
 * Convert full response to string.
 *
 * @method toString
 * @return {String}
 */
TuneManagementResponse.prototype.toString = function () {
  var string =
        '\nrequest_url:\t ' + this.requestUrl
      + '\nstatus_code:\t ' + this.getStatusCode()
      + '\nresponse_size:\t ' + this.getResponseSize()
      + '\ndata:\n' + prettyjson.render(this.getData(), {}, 2)
      + '\nhttp_code:\t\t' + this.getHttpCode()
      + '\nheaders:\n' + prettyjson.render(
        JSON.parse(JSON.stringify(this.getHeaders())),
        {},
        2
      ),
    errors = this.getErrors(),
    debugs = this.getDebugs();

  if (errors) {
    string = string + '\nerrors:\n' + prettyjson.render(
      JSON.parse(JSON.stringify(errors)),
      {},
      2
    );
  }
  if (debugs) {
    string = string + '\ndebugs:\t\t' + prettyjson.render(
      JSON.parse(JSON.stringify(debugs)),
      {},
      2
    );
  }
  return string;
};

/**
 * Get property of request URL used to generate this response.
 *
 * @property getRequestUrl
 * @return {String}
 */
TuneManagementResponse.prototype.getRequestUrl = function () {
  return this.requestUrl;
};

/**
 * Get property of full JSON response provided by
 * TUNE Advertiser Report service.
 *
 * @method getJSON
 * @return {Array}
 */
TuneManagementResponse.prototype.getJSON = function () {
  return this.response_json;
};

/**
 * Get property of HTTP status code returned from service proxy.
 *
 * @method getHeaders
 * @return mixed
 */
TuneManagementResponse.prototype.getHeaders = function () {
  return this.response_headers;
};

/**
 * Get property of HTTP status code returned from service proxy response.
 *
 * @method getHttpCode
 * @return {Integer}
 */
TuneManagementResponse.prototype.getHttpCode = function () {
  return this.response_http_code;
};

/**
 * Get property of data JSON response provided by TUNE Advertiser Report service.
 *
 * @method getData
 * @return {Array}
 */
TuneManagementResponse.prototype.getData = function () {
  if (this.response_json && this.response_json.hasOwnProperty('data')) {
    return this.response_json.data;
  }
  return null;
};

/**
 * TUNE Advertiser Report's response value pertaining to its key 'response_size'.
 *
 * @method getResponseSize
 * @return {Integer}
 */
TuneManagementResponse.prototype.getResponseSize = function () {
  if (this.response_json && this.response_json.hasOwnProperty('response_size')) {
    return this.response_json.response_size;
  }
  return null;
};

/**
 * TUNE Advertiser Report's response value pertaining to its key 'status_code'.
 *
 * @method getStatusCode
 * @return {Integer}
 */
TuneManagementResponse.prototype.getStatusCode = function () {
  if (this.response_json && this.response_json.hasOwnProperty('status_code')) {
    return this.response_json.status_code;
  }
  return null;
};

/**
 * TUNE Advertiser Report's response value pertaining to its key 'errors'
 * only if service experienced an error.
 *
 * @method getErrors
 * @return {Array}
 */
TuneManagementResponse.prototype.getErrors = function () {
  if (this.response_json && this.response_json.hasOwnProperty('errors')) {
    return this.response_json.errors;
  }
  return null;
};

/**
 * TUNE Advertiser Report's response value pertaining to its key 'debugs'
 * only if request's query string expressed for service to
 * provide debug information.
 *
 * @method getDebugs
 * @return {Array}
 */
TuneManagementResponse.prototype.getDebugs = function () {
  if (this.response_json && this.response_json.hasOwnProperty('debugs')) {
    return this.response_json.debugs;
  }
  return null;
};

module.exports = TuneManagementResponse;