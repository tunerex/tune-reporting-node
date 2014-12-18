#!/usr/bin/env node
/**
 * Classes that define TUNE Management API service access.
 *
 * @module base
 * @submodule service
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

function initializer() {}

initializer.TuneManagementClient = require('./TuneManagementClient');
initializer.TuneManagementResponse = require('./TuneManagementResponse');

module.exports = initializer;