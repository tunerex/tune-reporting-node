#!/usr/bin/env node
/**
 * Classes that define root Tune Management API endpoints.
 *
 * @module tune-reporting
 * @submodule api
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

function initializer() {}

initializer.AccountUsers = require('./AccountUsers');

initializer.AdvertiserReportActuals = require('./AdvertiserReportActuals');
initializer.AdvertiserReportActuals = require('./AdvertiserReportActuals');
initializer.AdvertiserReportClicks = require('./AdvertiserReportClicks');
initializer.AdvertiserReportEventItems = require('./AdvertiserReportEventItems');
initializer.AdvertiserReportEvents = require('./AdvertiserReportEvents');
initializer.AdvertiserReportInstalls = require('./AdvertiserReportInstalls');
initializer.AdvertiserReportCohort = require('./AdvertiserReportCohort');
initializer.AdvertiserReportPostbacks = require('./AdvertiserReportPostbacks');
initializer.AdvertiserReportRetention = require('./AdvertiserReportRetention');

initializer.Export = require('./Export');

module.exports = initializer;