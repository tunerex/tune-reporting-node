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
"use strict";

var
  util = require('util');

/**
 * Tune API SDK Error.
 *
 * @class TuneSdkError
 * @constructor
 * @extends Error
 *
 * @param string message
 * @param string value
 *
 */
function TuneSdkError(message, value) {
  this.message = message || 'Error occurred within Tune SDK';
  this.value = value;
}

util.inherits(TuneSdkError, Error);

module.exports = TuneSdkError;