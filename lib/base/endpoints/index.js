#!/usr/bin/env node
/**
 * Classes that define TUNE Advertiser Report endpoints base functionality.
 *
 * @module tune-reporting
 * @submodule endpoints
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

function initializer() {}

initializer.EndpointBase = require('./EndpointBase');
initializer.AdvertiserReportActualsBase = require('./AdvertiserReportActualsBase');
initializer.AdvertiserReportCohortBase = require('./AdvertiserReportCohortBase');
initializer.AdvertiserReportLogBase = require('./AdvertiserReportLogBase');

module.exports = initializer;