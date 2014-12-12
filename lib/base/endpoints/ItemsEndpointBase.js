#!/usr/bin/env node
/**
 * Classes that define Tune Management API endpoints base functionality.
 *
 * @module base
 * @submodule endpoints
 *
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

// Dependencies
var
  InvalidArgument = require('../../helpers').InvalidArgument,
  TuneServiceError = require('../../helpers').TuneServiceError,
  _ = require('underscore'),
  util     = require('util'),
  EndpointBase = require('./EndpointBase');

/**
 * Base class for handling Tune Management API endpoints pertaining
 * to data attributes.
 *
 * @class ItemsEndpointBase
 * @extends EndpointBase
 * @constructor
 *
 * @param string controller        Tune Management API endpoint name.
 * @param string apiKey           Tune MobileAppTracking API Key.
 * @param bool   verifyFields   Validate fields used by actions' parameters.
 */
function ItemsEndpointBase(
  controller,
  apiKey,
  verifyFields
) {
  ItemsEndpointBase.super_.call(
    this,
    controller,
    apiKey,
    verifyFields
  );
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(ItemsEndpointBase, EndpointBase);

/**
 * Counts all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method count
 *
 * @param string filter            Filter the results and apply conditions
 *                                that must be met for records to be
 *                                included in data.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ItemsEndpointBase.prototype.count = function (
  filter
) {
  if (filter) {
    filter = this.validateFilter(filter);
  }

  var mapQueryString = {
    'filter': filter
  };

  return this.request(
    'count',
    mapQueryString
  );
};

/**
 * Finds all existing records that match filter criteria
 * and returns an array of found model data.
 *
 * @method find
 *
 * @param string fields                No value returns default fields, "*"
 *                                    returns all available fields,
 *                                    or provide specific fields.
 * @param string filter                Filter the results and apply conditions
 *                                    that must be met for records to be
 *                                    included in data.
 * @param int    limit                 Limit number of results, default 10,
 *                                    0 shows all.
 * @param int    page                  Pagination, default 1.
 * @param dict   sort                  Expression defining sorting found
 *                                    records in result set base upon provided
 *                                    fields and its modifier (ASC or DESC).
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ItemsEndpointBase.prototype.find = function (
  fields,
  filter,
  limit,
  page,
  sort
) {
  if (fields) {
    fields = this.validateFields(fields);
  }
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (limit) {
    limit = this.validateLimit(limit);
  }
  if (page) {
    page = this.validatePage(page);
  }
  if (sort) {
    sort = this.validateSort(sort);
  }

  var mapQueryString = {
    'fields': fields,
    'filter': filter,
    'limit': limit,
    'page': page,
    'sort': sort
  };

  return this.request(
    'find',
    mapQueryString
  );
};

/**
 * Places a job into a queue to generate a report that will contain
 * records that match provided filter criteria, and it returns a job
 * identifier to be provided to action /export/download.json to download
 * completed report.
 *
 * @method exportReport
 *
 * @param string fields                Provide fields if format is 'csv'.
 * @param string filter                Filter the results and apply conditions
 *                                    that must be met for records to be
 *                                    included in data.
 * @param string format                Export format: csv, json
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ItemsEndpointBase.prototype.exportReport = function (
  fields,
  filter,
  format
) {
  if (fields) {
    fields = this.validateFields(fields);
  }
  if (filter) {
    filter = this.validateFilter(filter);
  }
  if (format) {
    format = this.validateFormat(format);
  }

  var mapQueryString = {
    'fields': fields,
    'filter': filter,
    'format': format
  };

  return this.request(
    'find_export_queue',
    mapQueryString
  );
};

/**
 * Query status of insight reports. Upon completion will
 * return url to download requested report.
 *
 * @method statusReport
 *
 * @param string jobId    Provided Job Identifier to reference
 *                        requested report on export queue.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ItemsEndpointBase.prototype.statusReport = function (
  jobId
) {
  return this._statusReport(
    'export',
    'download',
    jobId
  );
};

/**
 * Helper function for fetching report upon completion.
 *
 * @method fetchReport
 *
 * @param string jobId        Job identifier assigned for report export.
 * @param bool   verbose       For debug purposes to monitor job export completion status.
 * @param int    sleep         Polling delay for checking job completion status.
 *
 * @return {EventEmitter} Event containing service response.
 * @uses EventEmitter
 * @uses TuneManagementResponse
 */
ItemsEndpointBase.prototype.fetchReport = function (
  jobId,
  verbose,
  sleep,
  response
) {
  return this._fetchReport(
    'export',
    'download',
    jobId,
    verbose,
    sleep,
    response
  );
};

module.exports = ItemsEndpointBase;