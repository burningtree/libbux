# libbux
[![Dependency Status](https://david-dm.org/burningtree/libbux.svg)](https://david-dm.org/burningtree/libbux)

Un-official Javascript/Node.js library for [BUX](http://getbux.com) trading platform.

This is EXPERIMENTAL version. Use at your own risk.

## Table of contents
* [Installation](#installation)
* [Getting started](#getting-started)
* [User guide](#user-guide)
  * [Why use it?](#why-use-it)
  * [Authentication](#authentication)
  * [Understanding data](#understanding-data)
  * [Making trades](#making-trades)
  * [Configuration](#configuration)
  * [Symbols](#symbols)
* [API Reference](#api-reference)

## Installation

```
$ npm install libbux
```

## Getting started

#### Minimal example - [minimal.js](/examples/minimal.js)
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

## User guide

### Why use it?
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

### Understanding data
TODO

### Making trades
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
* **profile** `(callback)` - Your profile
* **friends** `(callback)` - Friends list
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
* **close** `(positionId, cb)` - Close position

#### Internal methods
* **[exec](#exec-method-endpoint-data-callback)** (method, endpoint, data, callback) - Execute BUX API call
* **findSymbolByProduct** (productId)
* **getEndpointUrl** (endpoint)

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
