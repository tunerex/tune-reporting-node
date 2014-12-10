#!/usr/bin/env node
/**
 * Classes that define account Tune Management API endpoints.
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

// Dependencies
var
  _ = require('underscore'),
  util = require('util'),
  ItemsEndpointBase = require('../base/endpoints').ItemsEndpointBase;

/**
 * Tune Management API endpoint '/account/users/'.
 *
 * @class AccountUsers
 * @constructor
 * @extends ItemsEndpointBase
 *
 * @param string api_key           Tune MobileAppTracking API Key.
 * @param bool   validate_fields   Validate fields used by actions' parameters.
 */
function AccountUsers(
  api_key,
  validate_fields
) {
  AccountUsers.super_.call(
    this,
    "account/users",
    api_key,
    validate_fields
  );
}

util.inherits(AccountUsers, ItemsEndpointBase);

module.exports = AccountUsers;