# libBUX
[![Build Status](https://travis-ci.org/burningtree/libbux.svg?branch=master)](https://travis-ci.org/burningtree/libbux) [![Dependency Status](https://david-dm.org/burningtree/libbux.svg)](https://david-dm.org/burningtree/libbux)

Un-official Javascript/Node.js library for [BUX](http://getbux.com) trading platform. Let's rock the world of finance!

It uses official REST & WebSockets APIs which are used for a BUX mobile applications. For these APIs, there is no public documentation and thus no official support from the BUX team. Keep in mind that any change in the interface may (temporarily) break this library.

Current version: **<span bux-data="version">0.2.1</span>**    
**This is EXPERIMENTAL version. Use at your own risk.**

## Table of contents
* [Installation](#installation)
* [Getting Started](#getting-started)
* [BUX Functionality](#bux-functionality)
* [User Guide](#user-guide)
  * [Why Use It?](#why-use-it)
  * [Authentication](#authentication)
  * [Understanding Data](#understanding-data)
  * [Making Trades](#making-trades)
  * [Configuration](#configuration)
  * [Symbols](#symbols)
* **[API Reference](#api-reference)**
* [Related Projects](#related-projects)

## Installation

Requires [Node.js](https://nodejs.org/en/) v4.0 or higher.
```
$ npm install libbux
```

## Getting Started

#### Example: Show my profits

Source: [examples/minimal.js](/examples/minimal.js)
```js
// Load library and get api interface
var BUX = require('libbux');
var bux = BUX.api();

// Specify account details
var account = {
  email: 'your_email@example.org',
  password: 'your_bux_password'
};

// Do login
bux.login(account, function(err, data) {
  if (err) throw err;

  // Here is your access_token, you can use it later
  console.log('Your access_token: '+data.access_token);

  // Get your portfolio
  bux.portfolio(function(err, data) {
    if (err) throw err;

    // Traverse portfolio and print your current products and profits
    for (var pos in data.positions) {
      var p = data.positions[pos];
      console.log('%s .. %s', p.product.displayName, p.profitAndLoss.amount);
    }
  });
});

```

## BUX Functionality

### Implemented
* Authentication - Login
* User - Profile, Friends, Notifications
* Products - List, Detail
* Trading - Open position, Close position
* Trading Fees - List
* Positions - List, Detail, History
* Portfolio - Cash Balance, Performance
* News - List
* Social Feed - List
* Real-time Data (WebSockets) - Un/Subscribe

### TODO
* Trading - Alerts, Auto-Close
* Groups / Battles - List, Feed, Post, Detail, Create
* Products - Search
* User - Settings, Invitations, Pincode operations
* Users - Detail, List?
* Transactions - List, Payment, Withdrawal

## User Guide

### Why Use It?
TODO

### Authentication

```js
var account = {
  email: 'your_email@example.org',
  password: 'your_bux_password'
}

bux.login(function(err, auth) {

  // Grab your token (for store)
  var token = data.access_token;

  // Your authenticated requests
  // ...
});
```

If you have *access_token* then you can setup library directly:
```js
// passed as config option
var bux = BUX.api({ access_token: 'MY_TOKEN' });

// or later
// TODO
```

### Understanding Data
TODO

### Making Trades
TODO

### Configuration

`BUX.api` options:
* `server` *(string)* - BUX API server address (default: `"https://api.bux.com"`)
* `no_symbols` *(boolean)* - Dont resolve Products Symbols (default: `false`)
* `access_token` *(string)* - Access Token

### Symbols
TODO

## API Reference

#### `BUX` methods and constants
* **api** (config) - Create API interface
* **symbols** - Built-in symbols
* **version** - libbux version

#### `BUX.api` instance methods

* **[login](#login-account-callback)** `(account, callback)` - Login
* **me** ``(callback)`` - Basic info about account
* **balance** ``(callback)`` - Cash balance
* **profile** `(callback)` - Your profile
* **friends** `(callback)` - Friends list
* **notifications** `(callback)` - List of pending notifications
* **news** `(callback)` - News articles
* **feed** `(callback)` - Social feed
* **product** `(productId, callback)` - Product detail
* **products** `(callback)` - Products list
* **fees** `(callback)` - Trading fees
* **portfolio** `(callback)` - Opened positions
* **position** `(positionId, callback)` - Position detail
* **performance** `(callback)` - Basic performance info
* **trades** `(callback)` - Trading history
* **[open](#open-trade-callback)** `(trade, callback)` - Open position
* **close** `(positionId, callback)` - Close position
* **[subscribe](#subscribe-eventsarray-callback)** `(eventsArray, callback, [onReady])` - Subscribe for Realtime data
* **subscribeProducts** `(productsArray, callback, [onReady])` - Subscribe for Product price changes
* **unsubscribe** `(eventsArray)` - Unsubscribe


#### Internal methods
* **[exec](#exec-method-endpoint-data-callback)** `(method, endpoint, data, callback)` - Execute BUX API call
* **getSymbols** `()`
* **setSymbols** `(symbolsObject)`
* **findSymbolByProduct** `(productId)`
* **getEndpointUrl** `(endpoint)`

### login (account, callback)
Login to BUX, get your *access_token*.

*account* object properties:
```js
{
  email: 'your_email@example.org',
  password: 'your_bux_password'
}
```
### open (trade, callback)

*trade* object properties:
```js
{
  product: '@DAX',    // productId or symbol
  direction: 'BUY',   // BUY or SELL
  size: 1000,         // Trade amount 
  multiplier: 5
}
```

### exec (method, endpoint, data, callback)
Short version for GET requests: **exec (method, endpoint, callback)**

Executes all raw BUX API calls. For more informations about BUX API endpoints, see [endpoints.yaml](/spec/v13/endpoints.yaml) file.

```js
bux.exec('get', 'users/me', function(err, me) {
  console.log(me.nickname);
});
```

### subscribe (eventsArray, callback)
Subscribe to Realtime data, for example:
```js
bux.subscribe([ 'portfolio.performance' ], function(res, type, data) {
  console.log('Got message: type=%s, data=%s', type, data);
});
```
Available events:
* `performance`
* `product.{securityId}` - (for example `product.sb33927`)
* `position.opened`
* `battle.created`
* `battle.finished`
* `group.followed`
* `notification`

## Related Projects
* [bitbar-bux](https://github.com/burningtree/bitbar-bux) - BUX Plugin for BitBar, application for customizing OS X Menu Bar

## TODO
* documentation
* tests

## Authors
Jan Stránský &lt;jan.stransky@arnal.cz&gt;

#### Donate
If you make profits and this work make you happy, you can donate any amount to my Bitcoin address: 
`1P1swvi7Y6tTYBgxBszr71CG3fc67C2oBD`

## Licence
MIT
