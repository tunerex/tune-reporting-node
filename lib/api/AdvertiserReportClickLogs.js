#!/usr/bin/env node
/**
 * Classes that define advertiser/stats TUNE Advertiser Report endpoints.
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
 * @version   $Date: 2014-12-22 13:38:30 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

// Dependencies
var
  util = require('util'),
  AdvertiserReportLogsBase = require('../base/endpoints').AdvertiserReportLogsBase;

/**
 * TUNE Advertiser Report endpoint '/advertiser/stats/clicks/'.
 *
 * @class AdvertiserReportClickLogs
 * @constructor
 * @extends AdvertiserReportLogsBase
 *
 * @param string apiKey           TUNE MobileAppTracking API Key.
 * @param bool   verifyFields   Validate fields used by actions' parameters.
 *
 */
function AdvertiserReportClickLogs(
  apiKey,
  verifyFields
) {
  AdvertiserReportClickLogs.super_.call(
    this,
    "advertiser/stats/clicks",
    apiKey,
    true,
    true,
    verifyFields
  );
}

util.inherits(AdvertiserReportClickLogs, AdvertiserReportLogsBase);

/**
 * Get list of recommended fields for endpoint.
 *
 * @property getFieldsRecommended
 * @protected
 * @return {Array}
 */
AdvertiserReportClickLogs.prototype.getFieldsRecommended = function () {
  return [
    'id',
    'created',
    'site_id',
    'site.name',
    'publisher_id',
    'publisher.name',
    'is_unique',
    'advertiser_sub_campaign_id',
    'advertiser_sub_campaign.ref',
    'publisher_sub_campaign_id',
    'publisher_sub_campaign.ref'
  ];
};

module.exports = AdvertiserReportClickLogs;