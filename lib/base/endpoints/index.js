#!/usr/bin/env node
/**
 * Classes that define Tune Management API endpoints base functionality.
 *
 * @module base
 * @submodule endpoints
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2014 Tune (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2014-12-12 11:53:57 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */

function initializer() {}

initializer.EndpointBase = require('./EndpointBase');
initializer.ItemsEndpointBase = require('./ItemsEndpointBase');
initializer.ReportsActualsEndpointBase = require('./ReportsActualsEndpointBase');
initializer.ReportsInsightEndpointBase = require('./ReportsInsightEndpointBase');
initializer.ReportsLogsEndpointBase = require('./ReportsLogsEndpointBase');

module.exports = initializer;