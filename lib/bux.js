(function() {
  var BUX, BUXProductSymbols, BUXVersion;

  BUXVersion = '0.1.0';

  BUXProductSymbols = {
    sb26491: 'AEX',
    sb26495: 'FTSE',
    sb26493: 'DAX',
    sb26515: 'TSLA',
    sb26500: 'XAU',
    sb26514: 'GOOG',
    sb28865: 'PM',
    sb28206: 'QCOM',
    sb28209: 'INTC',
    sb32256: 'FIT',
    sb27002: 'NFLX'
  };

  BUX = (function() {
    BUX.prototype.server = 'https://api.getbux.com';
    BUX.prototype.authHeaderToken = 'ODQ3MzYyMjk0MTpFSkFjb3V3RkdnVlpNVVpHZVJXNg==';
    BUX.prototype.headers = {
      'X-App-Version': '1.36-2697',
      'Accept-Language': 'en',
      'User-Agent': 'okhttp/3.2.0'
    };

    function BUX(config) {
      var self = this;
      var methods = ['get', 'post', 'put', 'delete'];

      this.config = config || {};
      this.agent = require('superagent');
      this.debug = require('debug')('libbux:main');
      this.debug('libbux initialized, version ' + BUXVersion);
      this.symbols = BUXProductSymbols;

      methods.forEach(function(method) {
        self[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(method);
          return self.exec.apply(self, args);
        };
      });
    }

    BUX.prototype.profile = function(callback) {
      return this.get('users/me/profile', callback);
    };

    BUX.prototype.me = function(callback) {
      return this.get('users/me', callback);
    };

    BUX.prototype.friends = function(callback) {
      return this.get('users/me/friends', callback);
    };

    BUX.prototype.news = function(callback) {
      return this.get('users/me/news', callback);
    };

    BUX.prototype.feed = function(callback) {
      return this.get('users/me/socialfeed', callback);
    };

    BUX.prototype.fees = function(callback) {
      return this.get('users/me/feeschedule', callback);
    };

    BUX.prototype.products = function(callback) {
      return this.get('products/search', callback);
    };

    BUX.prototype.portfolio = function(callback) {
      return this.get('users/me/portfolio', callback);
    };

    BUX.prototype.performance = function(callback) {
      return this.get('users/me/portfolio/performance', callback);
    };

    BUX.prototype.position = function(positionId, callback) {
      return this.get('users/me/portfolio/positions/' + positionId, callback);
    };

    BUX.prototype.trades = function(callback) {
      return this.get('users/me/trades', callback);
    };

    BUX.prototype.login = function(account, callback) {
      var query, request;
      var self = this;
      this.debug('Trying login with email: ' + account.email);
      query = {
        credentials: {
          email_address: account.email,
          password: account.password
        },
        type: 'email'
      };
      request = this.agent.post(this.getServer() + '/auth/3/authorize')
        .set('Content-Type', 'application/json; charset=UTF-8')
        .set('Authorization', 'Basic ' + this.authHeaderToken)
        .send(query);

      for (var h in this.headers) {
        request.set(h, this.headers[h]);
      }
      request.end(function(err, res){
        if (err) { return callback(err); }

        self.config.access_token = res.body.access_token;
        self.debug('Got access token: ' + self.config.access_token);
        callback(null, res.body);
      });
    };

    BUX.prototype.product = function(productId, callback) {
      if (!productId) { return callback('product not specified'); }

      var symbol = this.findProductBySymbol(productId);
      if (symbol) { productId = symbol; }

      return this.get('products/' + productId, function(err, product) {
          if (err) { return callback(err); }
          if (!product) { return callback('product not found'); }
          if (!product.securityId) { return callback(err); }
          return callback(err, product);
      });
    };

    BUX.prototype.open = function(trade, callback) {
      var data = {
        boostEffect: trade.multiplier.toString() || 1,
        homeCurrency: 'BUX',
        direction: trade.direction,
        productId: this.findProductBySymbol(trade.product) || trade.product,
        source: 'PRODUCTS_CURATED',
        tradeSize: trade.size.toString()
      };
      this.debug('Opening position: product=' + data.productId + ' dir=' + data.direction +
        ' size=' + data.tradeSize + ' multiplier=' + data.boostEffect);

      return this.post('users/me/trades', data, callback);
    };

    BUX.prototype.close = function(positionId, callback) {
      this.debug('Closing position: positionId=' + positionId);
      return this.delete('users/me/portfolio/positions/' + positionId, callback);
    };

    BUX.prototype.findProductBySymbol = function(symbol, arr) {
      var curSymbol, productId;
      if (this.config.no_symbols && !arr) { return null; }
      if (!arr) { arr = BUXProductSymbols; }
      for (productId in arr) {
        curSymbol = arr[productId];
        if (curSymbol.match(new RegExp('^' + symbol.replace('@', '') + '$', 'i'))) {
          return productId;
        }
      }
      return null;
    };

    BUX.prototype.exec = function(method, endpoint, data, callback) {
      var endpointUrl, request;
      var self = this;
      if (typeof data === 'function') { callback = data; }
      if (!this.config.access_token) { return callback('No access token!'); }

      endpoint = endpoint.replace(/^\/+/, '');
      endpointUrl = this.getEndpointUrl(endpoint);

      this.debug('Exec endpoint: ' + method + ' ' + endpoint);
      this.debug('Endpoint url: ' + endpointUrl);

      request = this.agent[method](endpointUrl)
        .set('Authorization', 'Bearer ' + this.config.access_token);

      for (var h in this.headers) {
        request.set(h, this.headers[h]);
      }
      if (method === 'post' || method === 'put') {
        if (typeof data !== 'object') { return callback('no data'); }

        request.set('Content-Type', 'application/json; charset=UTF-8');
        request.send(data);
      }
      request.end(function(err, res) {
        if (err) { return callback(err); }
        else if (res.status !== 200) { return callback('endpoint not found: ' + endpointUrl); }

        self.debug('Got data');
        return callback(null, res.body);
      });
    };

    // internal methods

    BUX.prototype.findSymbolByProduct = function(productId) {
      return BUXProductSymbols[productId];
    };

    BUX.prototype.getServer = function() {
      return this.config.server || this.server;
    };

    BUX.prototype.getEndpointUrl = function(endpoint) {
      var addon = (endpoint.substring(0, 1) !== '/' ? '/core/13/' : '');
      return this.getServer() + addon + endpoint;
    };

    return BUX;

  })();

  module.exports = {
    BUX: BUX,
    symbols: BUXProductSymbols,
    version: BUXVersion,
    api: function(config, callback) {
      var bux = new BUX(config);
      if (callback) { callback(bux); }
      return bux;
    }
  };

}).call(this);
