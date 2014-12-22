#!/usr/bin/env node
/**
 * Classes that define advertiser TUNE Advertiser Report endpoints.
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
  AdvertiserReportActualsBase = require('../base/endpoints').AdvertiserReportActualsBase;

/**
 * TUNE Advertiser Report endpoint '/advertiser/stats/'.
 *
 * @class AdvertiserReportActuals
 * @constructor
 * @extends AdvertiserReportActualsBase
 *
 * @param string apiKey           TUNE MobileAppTracking API Key.
 * @param bool   verifyFields   Validate fields used by actions' parameters.
 */
function AdvertiserReportActuals(
  apiKey,
  verifyFields
) {
  AdvertiserReportActuals.super_.call(
    this,
    "advertiser/stats",
    apiKey,
    true,
    true,
    verifyFields
  );
}

util.inherits(AdvertiserReportActuals, AdvertiserReportActualsBase);

/**
 * Get list of recommended fields for endpoint.
 *
 * @property getFieldsRecommended
 * @protected
 * @return {Array}
 */
AdvertiserReportActuals.prototype.getFieldsRecommended = function () {
  return [
    'site_id',
    'site.name',
    'publisher_id',
    'publisher.name',
    'ad_impressions',
    'ad_impressions_unique',
    'ad_clicks',
    'ad_clicks_unique',
    'paid_installs',
    'paid_installs_assists',
    'non_installs_assists',
    'paid_events',
    'paid_events_assists',
    'non_events_assists',
    'paid_opens',
    'paid_opens_assists',
    'non_opens_assists'
  ];
};

module.exports = AdvertiserReportActuals;