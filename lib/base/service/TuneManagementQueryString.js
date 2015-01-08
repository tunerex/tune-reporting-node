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
 * @version   $Date: 2015-01-08 13:24:24 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

// Dependencies
var
  _ = require('lodash'),
  querystring = require('querystring'),
  util = require('util'),
  InvalidArgument = require('../../helpers').InvalidArgument;

/**
 * Incrementally builds query string for TUNE Advertiser Report action.
 *
 * @class TuneManagementQueryString
 * @constructor
 *
 */
function TuneManagementQueryString() {
  this.mapQueryString = {};
}

/**
 * Add element to query string.
 *
 * @method add
 *
 * @param string name
 * @param mixed  value
 */
TuneManagementQueryString.prototype.add = function (name, value, callback) {
  var sort_field, sort_direction, sort_name, sort_value;

  if (!value
      || (_.isString(value) && (value.length === 0))
      ) {
    return;
  }

  if (!name
      || !_.isString(name)
      ) {
    callback(new InvalidArgument('Parameter "name" is not defined.'));
    return;
  }

  name = name.trim();

  if (name.length === 0) {
    callback(new InvalidArgument('Parameter "name" is not defined.'));
    return;
  }

  if (_.isString(value)) {
    value = value.trim();
    if (value.length === 0) {
      return;
    }
  }

  if (name === "fields") {
    value = value.replace(/\s+/g, '');
    this.encode(name, value);
  } else if (name === "sort") {
    for (sort_field in value) {
      if (value.hasOwnProperty(sort_field)) {
        sort_direction = value[sort_field].toUpperCase();
        if (!_.contains(['ASC', 'DESC'], sort_direction)) {
          callback(new InvalidArgument('Invalid sort direction' + sort_direction));
          return;
        }
        sort_name = 'sort[' + sort_field + ']';
        sort_value = sort_direction;
        this.encode(sort_name, sort_value);
      }
    }
  } else if (name === "filter") {
    value = value.replace(/\s+/g, ' ');
    this.encode(name, value);
  } else if (name === "group") {
    value = value.replace(/\s+/g, '');
    this.encode(name, value);
  } else if (_.isBoolean(value)) {
    value = (value === true) ? 'true' : 'false';
    this.encode(name, value);
  } else {
    this.encode(name, value);
  }
};

/**
 * URL query string element's name and value
 *
 * @method encode
 *
 * @param string name
 * @param mixed  value
 */
TuneManagementQueryString.prototype.encode = function (name, value) {
  this.mapQueryString[name] = value;
};

/**
 * Return built query string
 *
 * @property getQueryStringMap
 *
 * @return associative array
 */
TuneManagementQueryString.prototype.getQueryStringMap = function () {
  return this.mapQueryString;
};

/**
 * Custom string representation of object
 *
 * @method toString
 *
 * @return {String}
 */
TuneManagementQueryString.prototype.stringify = function () {
  return querystring.stringify(this.mapQueryString);
};

module.exports = TuneManagementQueryString;