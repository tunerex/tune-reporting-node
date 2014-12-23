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
 * @copyright 2014 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-23 07:55:28 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */

function initializer() {}

initializer.AdvertiserReportActuals = require('./AdvertiserReportActuals');
initializer.AdvertiserReportActuals = require('./AdvertiserReportActuals');
initializer.AdvertiserReportLogsClick = require('./AdvertiserReportLogsClick');
initializer.AdvertiserReportLogsEventItem = require('./AdvertiserReportLogsEventItem');
initializer.AdvertiserReportLogsEvent = require('./AdvertiserReportLogsEvent');
initializer.AdvertiserReportLogsInstall = require('./AdvertiserReportLogsInstall');
initializer.AdvertiserReportCohortValue = require('./AdvertiserReportCohortValue');
initializer.AdvertiserReportLogsPostback = require('./AdvertiserReportLogsPostback');
initializer.AdvertiserReportCohortRetention = require('./AdvertiserReportCohortRetention');

initializer.Export = require('./Export');

module.exports = initializer;