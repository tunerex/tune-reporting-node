#!/usr/bin/env node
/**
 * TUNE Reporting API module.
 *
 * @module tune-reporting
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-06 00:55:16 $
 * @link      http://developers.mobileapptracking.com @endlink
 */

function initializer() {}

initializer.api = require('./api');
initializer.base = require('./base');
initializer.helpers = require('./helpers');

module.exports = initializer;