#!/usr/bin/env node
/**
 * TUNE Reporting API module.
 *
 * @module tune-reporting
 * @main tune-reporting
 *
 * @category  tune-reporting-node
 *
 * @author    Jeff Tanner <jefft@tune.com>
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-06 14:33:18 $
 * @link      http://developers.mobileapptracking.com @endlink
 */

var convict = require("convict");

var config = convict({
  env: {
    doc: "TUNE Reporting SDK environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
    arg: "env"
  },
  tune: {
    reporting: {
      auth_key: {
        doc: "TUNE Reporting Authentication Key: MobileAppTracking API_KEY or Session token.",
        format: String,
        default: "UNDEFINED",
        arg: "tune_reporting_auth_key"
      },
      auth_type: {
        doc: "TUNE Reporting Authentication Type: api_key OR session_token.",
        format: String,
        default: "api_key",
        arg: "tune_reporting_auth_type"
      },
      validate_fields: {
        doc: "Validate use TUNE Management API fields used within action parameters.",
        format: Boolean,
        default: false,
        arg: "tune_reporting_validate_fields"
      },
      status: {
        sleep: {
          doc: "TUNE reporting export status sleep (seconds).",
          format: "int",
          default: 10,
          arg: "tune_reporting_status_sleep"
        },
        timeout: {
          doc: "TUNE reporting export fetch timeout (seconds).",
          format: "int",
          default: 240,
          arg: "tune_reporting_status_timeout"
        },
        verbose: {
          doc: "TUNE reporting export fetch verbose output.",
          format: Boolean,
          default: false,
          arg: "tune_reporting_status_verbose"
        }
      }
    }
  }
});

// load environment dependent configuration
config.loadFile("./config/" + config.get("env") + ".json");

// validate
config.validate();

module.exports = config;