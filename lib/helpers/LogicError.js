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
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-18 14:57:59 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */

var
  util = require('util');

/**
 * Logic Error.
 *
 * @class LogicError
 * @constructor
 * @extends Error
 *
 * @param string message
 * @param string value
 *
 */
function LogicError(message, value) {
  this.message = message || 'Logic error occurred.';
  this.value = value;
}

// Inherit the prototype methods from one constructor into another.
// The prototype of constructor will be set to a new object created from
// superConstructor.
util.inherits(LogicError, Error);

module.exports = LogicError;