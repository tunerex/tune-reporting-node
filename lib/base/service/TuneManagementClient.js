#!/usr/bin/env node
/**
 * Classes that define TUNE Advertiser Report service access.
 *
 * @module tune-reporting
 * @submodule service
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
  moduleinfo = require('../../../package.json'),
  InvalidArgument = require('../../helpers').InvalidArgument,
  _ = require('underscore'),
  util = require('util'),
  TuneManagementRequest = require('./TuneManagementRequest'),
  TuneManagementResponse = require('./TuneManagementResponse'),
  request = require('request'),
  clone = require('clone'),
  EventEmitter = require('events').EventEmitter;

/**
 * TUNE MobileAppTracking Management API client.
 *
 * @class TuneManagementClient
 * @constructor
 * @extends EventEmitter
 *
 * @param string   controller     TUNE Advertiser Report endpoint name.
 * @param string   action         TUNE Advertiser Report endpoint's action name.
 * @param string   authKey        TUNE Authentication Key.
 * @param string   authType       TUNE Authentication Type.
 * @param dict     mapQueryString Action's query string parameters.
 */
function TuneManagementClient(
  controller,
  action,
  authKey,
  authType,
  mapQueryString
) {
  EventEmitter.call(this);

  this.req = undefined;
  this.rep = undefined;

  if (!controller
      || !_.isString(controller)
      || (controller.length === 0)
      ) {
    throw new InvalidArgument('Parameter "controller" is not defined.');
  }
  if (!action
      || !_.isString(action)
      || (action.length === 0)
      ) {
    throw new InvalidArgument('Parameter "action" is not defined.');
  }
  if (mapQueryString
      && !_.isObject(mapQueryString)
      ) {
    throw new InvalidArgument('Parameter "mapQueryString" is not defined.');
  }

  this.req = new TuneManagementRequest(
    controller,
    action,
    authKey,
    authType,
    mapQueryString
  );
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(TuneManagementClient, EventEmitter);

/**
 * Execute to send request to TUNE Advertiser Report, and determine success
 * or failure based upon its service's response.
 *
 * @method request
 *
 * @param callback response
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
TuneManagementClient.prototype.getClientRequest = function (callback) {

  var
    self = clone(this),

    // Set the headers
    headers = {
      'Content-Type':   'application/json; charset=utf-8',
      'User-Agent':     moduleinfo.name + '/' + moduleinfo.version
    },
    uri = this.req.getPath(),
    qs = this.req.getQueryStringMap(),

    formattedError,
    success = false,

    // Configure the request
    options = {
      url: uri.toString(),
      method: 'GET',
      json: true,
      headers: headers,
      qs: qs
    };

  try {
    // Start the request
    request(options, function (err, response, body) {
      var data, error = null;
      try {
        data = err || !body
          ? {'status': 500, 'message': 'Empty body'}
          : body;
      } catch (e) {
        data = { 'status': e.code, 'message': e.message };
      }

      if (err || (response && (response.statusCode < 200 || response.statusCode > 206))) {
        error = {};
        error.requestUrl = self.req.getUrl();
        // response is null if server is unreachable
        if (response) {
          error.httpStatusCode = response.statusCode;
        } else {
          error.httpStatusCode = err.code;
          error.message = 'Unable to reach host';
        }
        if (body) {
          error.serviceStatusCode = body.status_code;
        }
      } else if (body
          && body.hasOwnProperty('status_code')
          && ((body.status_code < 200 || body.status_code > 206))
          ) {

        error = {};
        error.serviceStatusCode = body.status_code;
        error.httpStatusCode = response.statusCode;
        error.requestUrl = self.req.getUrl();

        // response is null if server is unreachable
        if (body.hasOwnProperty('errors')) {
          if (body.errors instanceof Array
              && 0 < body.errors.length
              && typeof body.errors[0] !== 'undefined'
              ) {

            if (body.errors[0].hasOwnProperty('message')) {
              error.message = body.errors[0].message;
            }
          }

        } else {
          error.message = 'Unable to reach host';
        }
      }

      response = new TuneManagementResponse(
        self.req.getUrl(),
        body,
        (response && response.hasOwnProperty('headers'))
          ? response.headers
          : null,
        (response && response.hasOwnProperty('statusCode'))
          ? response.statusCode
          : error.statusCode
      );

      if (error) {
        if (typeof callback !== 'undefined') {
          callback(error, null);
        }

        self.emit('error', error);
      } else {
        if (typeof callback !== 'undefined') {
          callback(null, response);
        }
        self.emit('success', response);
      }
    }); // end request callback

  } catch (err) {
    if (typeof callback !== 'undefined') {
      callback(err);
    }
    self.emit('error', err);
  }

  return self;
};

/**
 * Get request property for this request.
 *
 * @property getRequest
 * @return {TuneManagementRequest} object
 * @uses TuneManagementRequest
 */
TuneManagementClient.prototype.getRequest = function () {
  return this.req;
};

/**
 * Get response property for this request.
 *
 * @property getResponse
 * @return {TuneManagementResponse} object
 * @uses TuneManagementResponse
 */
TuneManagementClient.prototype.getResponse = function () {
  return this.rep;
};

module.exports = TuneManagementClient;