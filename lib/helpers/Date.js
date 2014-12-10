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

var
  util = require('util');

/**
 * Returns yesterday's date in format YYYY-MM-DD.
 *
 * @method yesterday
 *
 * @return {String}
 */
Date.prototype.yesterdayDate = function () {
  var
    yesterday = this,
    dd,
    mm,
    yyyy;

  yesterday.setDate(yesterday.getDate() - 1);

  dd = yesterday.getDate();
  mm = yesterday.getMonth() + 1;
  yyyy = yesterday.getFullYear();

  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }
  return util.format('%s-%s-%s', yyyy, mm, dd);
};

/**
 * Returns week ago date in format YYYY-MM-DD.
 *
 * @method week_ago
 *
 * @return {String}
 */
Date.prototype.oneWeekAgoDate = function () {
  var week_ago = this,
    dd,
    mm,
    yyyy;

  week_ago.setDate(week_ago.getDate() - 8);

  dd = week_ago.getDate();
  mm = week_ago.getMonth() + 1;
  yyyy = week_ago.getFullYear();

  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }
  return util.format('%s-%s-%s', yyyy, mm, dd);
};

/**
 * Prepend YYYY-MM-DD with 23:59:59
 *
 * @method start_date
 *
 * @param Date
 *
 * @return {String}
 */
Date.prototype.startDateTime = function (date) {
  return util.format('%s 00:00:00', date);
};

/**
 * Prepend YYYY-MM-DD with 00:00:00
 *
 * @method end_date
 *
 * @param Date
 *
 * @return {String}
 */
Date.prototype.endDateTime = function (date) {
  return util.format('%s 23:59:59', date);
};