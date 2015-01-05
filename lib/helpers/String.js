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
 * @version   $Date: 2015-01-05 10:18:08 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

/**
 * Check if string ends with provided sub-string.
 *
 * @method endsWith
 *
 * @param string str
 *
 * @return {Boolean}
 */
String.prototype.endsWith = function (str) {
  return (this.match(str + "$") === str);
};

/**
 * Check if string begins with provided sub-string.
 *
 * @method startsWith
 *
 * @param string str
 *
 * @return {Boolean}
 */
String.prototype.startsWith = function (str) {
  return (this.match("^" + str) === str);
};