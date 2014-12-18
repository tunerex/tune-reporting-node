#!/usr/bin/env node
/**
 * Classes that define advertiser/stats TUNE Management API endpoints.
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
 * @version   $Date: 2014-12-18 14:57:59 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

// Dependencies
var
  util = require('util'),
  ReportsLogsEndpointBase = require('../base/endpoints').ReportsLogsEndpointBase;

/**
 * TUNE Management API endpoint '/advertiser/stats/events/'.
 *
 * @class AdvertiserReportEvents
 * @constructor
 * @extends ReportsLogsEndpointBase
 *
 * @param string apiKey           TUNE MobileAppTracking API Key.
 * @param bool   verifyFields   Validate fields used by actions' parameters.
 */
function AdvertiserReportEvents(
  apiKey,
  verifyFields
) {
  AdvertiserReportEvents.super_.call(
    this,
    "advertiser/stats/events",
    apiKey,
    true,
    true,
    verifyFields
  );
}

util.inherits(AdvertiserReportEvents, ReportsLogsEndpointBase);

/**
 * Get list of recommended fields for endpoint.
 *
 * @property getFieldsRecommended
 * @protected
 * @return {Array}
 */
AdvertiserReportEvents.prototype.getFieldsRecommended = function () {
  return [
    'id',
    'stat_install_id',
    'created',
    'status',
    'site_id',
    'site.name',
    'site_event_id',
    'site_event.name',
    'site_event.type',
    'publisher_id',
    'publisher.name',
    'advertiser_ref_id',
    'advertiser_sub_campaign_id',
    'advertiser_sub_campaign.ref',
    'publisher_sub_campaign_id',
    'publisher_sub_campaign.ref',
    'user_id',
    'device_id',
    'os_id',
    'google_aid',
    'ios_ifa',
    'ios_ifv',
    'windows_aid',
    'referral_url',
    'is_view_through',
    'is_reengagement'
  ];
};

module.exports = AdvertiserReportEvents;