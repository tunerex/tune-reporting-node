#!/usr/bin/env node
// define global objects:
/*global describe, before, it*/

// define jslint-options:
/* jshint -W030 -W036 */

/**
 * Tests of TUNE Reporting API
 *
 * @module tune-reporting
 * @submodule test
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

var
  expect = require('chai').expect;

describe('test environment "apiKey"', function () {
  var apiKey = process.env.API_KEY;
  describe('api_key', function () {
    it('API Key is declared.', function (done) {
      expect(apiKey).to.be.a('string');
      done();
    });
    it('API Key is defined.', function (done) {
      expect(apiKey).not.empty;
      done();
    });
  });
});