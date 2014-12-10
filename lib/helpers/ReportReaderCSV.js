#!/usr/bin/env node
/**
 * Classes that define Tune API utilities.
 *
 * @module tune-reporting
 * @submodule helpers
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
  util     = require('util'),
  _ = require('underscore'),
  request = require('request'),
  Table = require('cli-table'),
  clone = require('clone'),
  EventEmitter = require('events').EventEmitter;

/**
 * Report Reader of remote CSV file.
 *
 * @class ReportReaderCSV
 * @constructor
 * @extends EventEmitter
 *
 * @param string report_url Remote CSV report URL
 */
function ReportReaderCSV(
  report_url
) {
  EventEmitter.call(this);
  this.report_url = report_url;
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(ReportReaderCSV, EventEmitter);

/**
 * Prettyprint CSV report body
 *
 * @method prettyprint
 *
 * @param integer limit Number or CSV rows to print.
 *
 * @return {String}
 */
ReportReaderCSV.prototype.prettyprint = function (limit, callback) {

  var
    self = clone(this);

  limit = limit && _.isNumber(limit) && (limit > 0) ? limit + 1 : 10;
  self.response = null;

  request.get(this.report_url, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var
        csv_rows = body.split('\n'),
        max_rows = Math.min(limit, csv_rows.length),
        data_print = csv_rows.slice(0, max_rows),
        table = new Table({
          head: data_print[0].split(',')
        }),
        i;

      for (i = 1; i < max_rows; i++) {
        table.push(data_print[i].split(','));
      }

      self.response = table.toString();
      if (typeof callback !== 'undefined') {
        callback(null, self.response);
      }
      self.emit('success', self.response);
    } else {
      if (typeof callback !== 'undefined') {
        callback(error, null);
      }
      self.emit('error', error);
    }
  });

  return self;
};



module.exports = ReportReaderCSV;