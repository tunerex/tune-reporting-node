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
 * @version   $Date: 2014-12-12 11:53:57 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */

var
  util = require('util');

/**
 * Returns yesterday's date in format YYYY-MM-DD.
 *
 * @method yesterday
 *
 * @return {String}
 */
Date.prototype.setYesterday = function () {
  this.setDate(this.getDate() - 1);
  return this;
};

/**
 * Returns week ago date in format YYYY-MM-DD.
 *
 * @method week_ago
 *
 * @return {String}
 */
Date.prototype.setOneWeekAgo = function () {
  this.setDate(this.getDate() - 8);
  return this;
};

/**
 * Prepend YYYY-MM-DD with 23:59:59
 *
 * @method startDate
 *
 * @param Date
 *
 * @return {String}
 */
Date.prototype.setStartTime = function () {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  return this;
};

/**
 * Prepend YYYY-MM-DD with 23:59:59
 *
 * @method endDate
 *
 * @param Date
 *
 * @return {String}
 */
Date.prototype.setEndTime = function () {
  this.setHours(23);
  this.setMinutes(59);
  this.setSeconds(59);
  return this;
};

/**
 * Provide ISO formatted date time
 */
Date.prototype.getIsoDateTime = function ()  {

  var ss = this.getSeconds(),
      ii = this.getMinutes(),
      hh = this.getHours(),
      dd = this.getDate(),
      mm = this.getMonth() + 1;
      yyyy = this.getFullYear();

  if (ss < 10) { ss = '0' + ss; }
  if (ii < 10) { ii = '0' + ii; }
  if (hh < 10) { hh = '0' + hh; }
  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }

  return util.format('%s-%s-%s %s:%s:%s', yyyy, mm, dd, hh, ii, ss);
}