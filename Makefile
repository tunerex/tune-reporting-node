#   Makefile
#
#   Copyright (c) 2014 Tune, Inc
#   All rights reserved.
#
#   Permission is hereby granted, free of charge, to any person obtaining a copy
#   of this software and associated documentation files (the "Software"), to deal
#   in the Software without restriction, including without limitation the rights
#   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#   copies of the Software, and to permit persons to whom the Software is
#   furnished to do so, subject to the following conditions:
#
#   The above copyright notice and this permission notice shall be included in
#   all copies or substantial portions of the Software.
#
#   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#   FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
#   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
#   THE SOFTWARE.
#
# category  Tune
# package   tune.tests
# author    Jeff Tanner <jefft@tune.com>
# copyright 2014 Tune (http://www.tune.com)
# license   http://opensource.org/licenses/MIT The MIT License (MIT)
# version   $Date: 2014-12-10 07:44:51 $
# link      http://developers.mobileapptracking.com/tune-api-sdks/
#

export API_KEY=$(api_key)

clean:
	sudo rm -fR ./docs/yuidoc/*

examples:
	node ./examples/ExampleTuneManagementClient $(api_key)
	node ./examples/ExampleAccountUsers $(api_key)
	node ./examples/ExampleAdvertiserReportClicks $(api_key)
	node ./examples/ExampleAdvertiserReportEventItems $(api_key)
	node ./examples/ExampleAdvertiserReportEvents $(api_key)
	node ./examples/ExampleAdvertiserReportInstalls $(api_key)
	node ./examples/ExampleAdvertiserReportPostbacks $(api_key)
	node ./examples/ExampleAdvertiserReportActuals $(api_key)
	node ./examples/ExampleAdvertiserReportCohort $(api_key)
	node ./examples/ExampleAdvertiserReportRetention $(api_key)


test-install:
	npm install mocha, chai, should, sinon -g

test:
	@NODE_ENV=test ./node_modules/.bin/mocha

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--growl \
		--watch

test-cov: lib-cov
	@INSTINCT_COV=1 $(MAKE) test REPORTER=html-cov > public/coverage.html

lib-cov:
	@jscoverage lib lib-cov

lint:
	node node_modules/nodelint/nodelint ./lib/ ./examples/ | more

npm-install:
	npm install

nvm-install:
	unset NVM_DIR
	curl https://raw.githubusercontent.com/creationix/nvm/v0.10.0/install.sh | sh
	nvm ls-remote
	nvm install 0.10.33
	node -v
	npm -v

docs-yuidoc:
	sudo rm -fR ./docs/yuidoc/*
	yuidoc ./lib/
	x-www-browser docs/yuidoc/index.html

.PHONY: lint npm-install nvm-install docs-yuidoc test test-w examples