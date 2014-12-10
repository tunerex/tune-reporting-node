#!/usr/bin/env node
// define global objects:
/*global describe, before, it*/

// define jslint-options:
/* jshint -W030 -W036 */

/**
 * Tests of Tune Reporting API
 *
 * @module tune-reporting
 * @submodule test
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
"use strict";

var
  expect = require('chai').expect;

describe('test environment "api_key"', function () {
  var api_key = process.env.API_KEY;
  describe('api_key', function () {
    it('API Key is declared.', function (done) {
      expect(api_key).to.be.a('string');
      done();
    });
    it('API Key is defined.', function (done) {
      expect(api_key).not.empty;
      done();
    });
  });
});