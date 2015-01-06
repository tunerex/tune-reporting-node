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
 * @copyright 2015 TUNE, Inc. (http://www.tune.com)
 * @license   http://opensource.org/licenses/MIT The MIT License (MIT)
 * @version   $Date: 2015-01-06 14:33:18 $
 * @link      http://developers.mobileapptracking.com @endlink
 */
"use strict";

var
  config = require('../config.js'),
  tuneReporting = require('../lib'),
  SessionAuthenticate = tuneReporting.api.SessionAuthenticate,
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
    apiKey = undefined,
    client = undefined;

  before(function () {
    apiKey = process.env.API_KEY;
    config.set('tune.reporting.auth_key', apiKey);
    config.set('tune.reporting.auth_type', 'api_key');
    client = new TuneManagementClient(
      'account/users',
      'find',
      apiKey,
      'api_key',
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
  });

  it('make request using callback', function (done) {
    client.getClientRequest(function (error, response) {
      expect(error).to.be.null;
      expect(response).to.be.not.null;
      expect(response.getRequestUrl()).to.be.not.null;
      expect(response.getRequestUrl()).to.be.a('string');
      expect(response.getRequestUrl()).to.be.not.empty;
      expect(response.getData()).to.be.not.null;
      done();
    });
  });

  it('make request using events', function (done) {
    var clientRequest = client.getClientRequest();
    clientRequest.on('success', function onSuccess(response) {
      expect(response).to.be.not.null;
      expect(response.getRequestUrl()).to.be.not.null;
      expect(response.getRequestUrl()).to.be.a('string');
      expect(response.getRequestUrl()).to.be.not.empty;
      expect(response.getData()).to.be.not.null;
      done();
    });

    clientRequest.on('error', function onError(response) {
      done(response);
    });
  });

  it('make request using sinon spy', function (done) {
    var
      callbackSpy = spy(),
      clientRequest = client.getClientRequest(callbackSpy);

    clientRequest.on('success', function onSuccess(response) {
      expect(response).to.be.not.null;
      expect(response.getRequestUrl()).to.be.not.null;
      expect(response.getRequestUrl()).to.be.a('string');
      expect(response.getRequestUrl()).to.be.not.empty;
      expect(response.getData()).to.be.not.null;
      assert.equal(callbackSpy.called, true);
      done();
    });

    clientRequest.on('error', function onError(response) {
      done(response);
    });
  });
});