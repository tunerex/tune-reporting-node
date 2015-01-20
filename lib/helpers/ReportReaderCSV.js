#!/usr/bin/env node
/**
 * Classes that define TUNE Reporting API utilities.
 *
 * @module tune-reporting
 * @submodule helpers
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-20 14:17:43 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

var
  _ = require('lodash'),
  clone = require('clone'),
  EventEmitter = require('events').EventEmitter,
  https = require('https'),
  Table = require('cli-table'),
  url = require("url"),
  util = require('util');

/**
 * Report Reader of remote CSV file.
 *
 * @class ReportReaderCSV
 * @constructor
 * @extends EventEmitter
 *
 * @param string urlReport Remote CSV report URL
 */
function ReportReaderCSV(
  urlReport
) {
  EventEmitter.call(this);
  this.urlReport = urlReport;
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
    self = clone(this),
    host = url.parse(this.urlReport).hostname,
    path = url.parse(this.urlReport).path,
    // Configure the request
    options = {
      host: host,
      port: 443,
      method: 'GET',
      path: path
    },
    req;

  limit = limit && _.isNumber(limit) && (limit > 0) ? limit + 1 : 10;
  self.response = null;

  try {
    req = https.request(options, function(res) {
      var
        data = "",
        error;

      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function () {
        var
          csvData = data.split('\n'),
          maxRows = Math.min(limit, csvData.length),
          csvPrint = csvData.slice(0, maxRows),
          table = new Table({
            head: csvPrint[0].split(',')
          }),
          i;

        for (i = 1; i < maxRows; i++) {
          table.push(csvPrint[i].split(','));
        }

        self.response = table.toString();
        if (typeof callback !== 'undefined') {
          callback(null, self.response);
        }
        self.emit('success', self.response);
      });
    });

    req.on('error', function(err) {
      if (typeof next !== 'undefined') {
        next(err);
      }
      self.emit('error', err);
    });

    req.end();
  } catch (err) {
    if (typeof next !== 'undefined') {
      next(err);
    }
    self.emit('error', err);
  }

  return self;
};



module.exports = ReportReaderCSV;