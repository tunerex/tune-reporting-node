<h2>tune-reporting</h2>
<h2>Tune Reporting SDK for Node.js</h2>
<h3>Incorporate Tune Reporting API services.</h3>
<h4>Update:  $Date: 2014-12-12 13:00:00 $</h4>
<h4>Version: 0.1.3</h4>
===

[![NPM](https://nodei.co/npm/tune-reporting.png?downloads=true&stars=true)](https://nodei.co/npm/tune-reporting/)

### Overview

This node helper library for Tune Reporting API services.

The utility focus of this SDK is upon the Advertiser Reporting endpoints.

Even though the the breadth of the Management API goes beyond just reports, it is these endpoints that our customers primarily access.

The second goal of the SDKs is to assure that our customers’ developers are using best practices in gathering reports in the most optimal way.

### Documentation

Please see documentation here:

[Tune API SDKs](https://developers.mobileapptracking.com/tune-reporting-sdks/)

<a name="sdk_requirements"></a>
### SDK Requirements

<a name="sdk_prerequisites"></a>
#### Prerequisites

    * node >= 0.10.*
    * npm => 1.4.*

<a name="generate_api_key"></a>
#### Generate API Key

To use SDK, it requires you to [Generate API Key](http://developers.mobileapptracking.com/generate-api-key/)

<a name="sdk_installation"></a>
### Installation

You can install **tune-reporting** via *npm* or by downloading the source from github.

<a name="sdk_installation_npm"></a>
#### Via npm:
It is available on [npm](https://www.npmjs.com/): [*tune-reporting*](https://www.npmjs.com/package/tune-reporting)

Install as follows

```bash
    $ npm install tune-reporting
```

<a name="sdk_installation_zip"></a>
##### Via ZIP file:

[Click here to download the source code
(.zip)](https://github.com/MobileAppTracking/tune-reporting-node/archive/master.zip) for `tune-reporting`.

```bash
    $ git clone git@github.com:MobileAppTracking/tune-reporting-node
    $ cd tune-reporting-node
    $ npm install
```


<a name="sdk_examples"></a>
#### SDK Examples

Run the following script to view execution of all examples:

```bash
    $ make api_key=[API_KEY] examples
```

<a name="sdk_unittests"></a>
#### SDK Unittests

Run the following script to view execution of all unittests:

```bash
    $ npm install --save-dev
    $ make api_key=[API_KEY] tests
```

<a name="sdk_documentation"></a>
#### SDK Documentation

The following will generate [YUIDoc](http://yui.github.io/yuidoc/) from Node.js codebase:

```bash
    $ npm install yuidoc
    $ make docs-yuidoc
```

<a name="license"></a>
### License

[MIT License](http://opensource.org/licenses/MIT)

<a name="sdk_reporting_issues"></a>
### Reporting Issues

Report issues using the [Github Issue Tracker](https://github.com/MobileAppTracking/tune-reporting-node/issues) or Email [sdk@tune.com](mailto:sdk@tune.com).
