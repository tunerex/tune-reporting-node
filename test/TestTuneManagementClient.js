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
 * @version   $Date: 2014-12-12 11:53:57 $
 * @link      http://developers.mobileapptracking.com/tune-reporting-sdks/ @endlink
 */
"use strict";

var
  tuneReporting = require('../lib'),
  TuneManagementClient = tuneReporting.base.service.TuneManagementClient,
  TuneManagementRequest = tuneReporting.base.service.TuneManagementRequest,
  _ = require('underscore'),
  util = require('util'),
  async = require('async'),
  stackTrace = require('stack-trace'),
  expect = require('chai').expect,
  assert = require('chai').assert,
  spy = require('sinon').spy,
  client,
  eventEmitterStub,
  callbackSpy,
  clock;

describe('test TuneManagementClient', function () {
  var
    apiKey = process.env.API_KEY,
    client = null;
  before(function () {
    client = new TuneManagementClient(
      'account/users',
      'find',
      apiKey,
      {
        'limit' : 5,
        'filter' : "(first_name LIKE '%a%')"
      }
    );
  });
  describe('check instance', function () {
    it('client created', function (done) {
      assert(client);
      done();
    });
    it('client getRequest', function (done) {
      assert(client.getRequest());
      done();
    });
    it('client getController', function (done) {
      expect(client.getRequest()).to.have.property('controller');
      expect(client.getRequest().getController()).to.be.a('string');
      expect(client.getRequest().getController()).to.be.not.empty;
      done();
    });
    it('client getAction', function (done) {
      expect(client.getRequest()).to.have.property('action');
      expect(client.getRequest().getAction()).to.be.a('string');
      expect(client.getRequest().getAction()).to.be.not.empty;
      done();
    });
    it('client API Key', function (done) {
      expect(client.getRequest()).to.have.property('apiKey');
      expect(client.getRequest().getApiKey()).to.be.a('string');
      expect(client.getRequest().getApiKey()).to.be.not.empty;
      done();
    });
  });

  it('make request using callback', function (done) {
    client.request(function(error, result) {
      expect(error).to.be.null;
      expect(result).to.be.not.null;
      expect(result.getRequestUrl()).to.be.not.null;
      expect(result.getRequestUrl()).to.be.a('string');
      expect(result.getRequestUrl()).to.be.not.empty;
      expect(result.getData()).to.be.not.null;
      done();
    });
  });

  it('make request using events', function (done) {
    var client_request = client.request();
    client_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getRequestUrl()).to.be.not.null;
      expect(result.getRequestUrl()).to.be.a('string');
      expect(result.getRequestUrl()).to.be.not.empty;
      expect(result.getData()).to.be.not.null;
      done();
    });

    client_request.on('error', function onError (response) {
      done(response);
    });
  });

  it('make request using sinon spy', function (done) {
    var
      callbackSpy = spy(),
      client_request = client.request(callbackSpy);

    client_request.on('success', function onSuccess (result) {
      expect(result).to.be.not.null;
      expect(result.getRequestUrl()).to.be.not.null;
      expect(result.getRequestUrl()).to.be.a('string');
      expect(result.getRequestUrl()).to.be.not.empty;
      expect(result.getData()).to.be.not.null;
      assert.equal(callbackSpy.called, true);
      done();
    });

    client_request.on('error', function onError (response) {
      done(response);
    });
  });
});