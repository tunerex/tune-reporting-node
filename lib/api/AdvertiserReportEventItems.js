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
 * TUNE Management API endpoint '/advertiser/stats/event/items/'.
 *
 * @class AdvertiserReportEventItems
 * @constructor
 * @extends ReportsLogsEndpointBase
 *
 * @param string apiKey           TUNE MobileAppTracking API Key.
 * @param bool   verifyFields   Validate fields used by actions' parameters.
 */
function AdvertiserReportEventItems(
  apiKey,
  verifyFields
) {
  AdvertiserReportEventItems.super_.call(
    this,
    "advertiser/stats/event/items",
    apiKey,
    false,
    true,
    verifyFields
  );
}

util.inherits(AdvertiserReportEventItems, ReportsLogsEndpointBase);

/**
 * Get list of recommended fields for endpoint.
 *
 * @property getFieldsRecommended
 * @protected
 * @return {Array}
 */
AdvertiserReportEventItems.prototype.getFieldsRecommended = function () {
  return [
    'id',
    'created',
    'site_id',
    'site.name',
    'campaign_id',
    'campaign.name',
    'site_event_id',
    'site_event.name',
    'site_event_item_id',
    'site_event_item.name',
    'quantity',
    'value_usd',
    'country_id',
    'country.name',
    'region_id',
    'region.name',
    'agency_id',
    'agency.name',
    'advertiser_sub_site_id',
    'advertiser_sub_site.name',
    'advertiser_sub_campaign_id',
    'advertiser_sub_campaign.name',
    'currency_code',
    'value'
  ];
};

module.exports = AdvertiserReportEventItems;