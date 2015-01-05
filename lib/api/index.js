#!/usr/bin/env node
/**
 * Classes that define root TUNE Advertiser Report endpoints.
 *
 * @module tune-reporting
 * @submodule api
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

initializer.AdvertiserReportActuals = require('./AdvertiserReportActuals');
initializer.AdvertiserReportLogClicks = require('./AdvertiserReportLogClicks');
initializer.AdvertiserReportLogEventItems = require('./AdvertiserReportLogEventItems');
initializer.AdvertiserReportLogEvents = require('./AdvertiserReportLogEvents');
initializer.AdvertiserReportLogInstalls = require('./AdvertiserReportLogInstalls');
initializer.AdvertiserReportLogPostbacks = require('./AdvertiserReportLogPostbacks');
initializer.AdvertiserReportCohortValue = require('./AdvertiserReportCohortValue');
initializer.AdvertiserReportCohortRetention = require('./AdvertiserReportCohortRetention');

initializer.Export = require('./Export');

module.exports = initializer;