(function() {
  "use strict";

  const BUXVersion = '0.2.7';

  const BUX = (function() {
    BUX.prototype.server = 'https://api.getbux.com';
    BUX.prototype.ws = 'https://rtf.getbux.com/subscriptions/me';
    BUX.prototype.authHeaderToken = 'ODQ3MzYyMjk0MjpqVkJJakF2ZnhUYk4ycHZkRDAwbA==';
    BUX.prototype.countries = [ 'NL', 'GB', 'DE', 'AT' ];
    BUX.prototype.headers = {
      'X-App-Version': '1.53-4423',
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
      this.symbols = {};

      methods.forEach(function(method) {
        self[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          args.unshift(method);
          return self.exec.apply(self, args);
        };
      });
    }

    // TODO: does not exist anymore?
    // BUX.prototype.profile = function(callback) {
    //   return this.get('users/me/profile', callback);
    // };

    BUX.prototype.me = function(callback) {
      return this.get('users/me', callback);
    };

    BUX.prototype.friends = function(callback) {
      return this.get('users/me/friends', callback);
    };

    // Note: different endpoint
    BUX.prototype.notifications = function(callback) {
      return this.get('/social/16/users/me/notifications', callback);
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

    BUX.prototype.productSearch = function(query, callback) {
      return this.get('products/search?', { q: query }, callback);
    };

    // TODO: endpoint and name changed??
    BUX.prototype.portfolios = function(callback) {
      return this.get('users/me/portfolios', callback);
    };

    BUX.prototype.performance = function(callback) {
      return this.get('users/me/portfolio/performance', callback);
    };

    BUX.prototype.balance = function(callback) {
      return this.get('users/me/portfolio/cashBalance', callback);
    };

    BUX.prototype.position = function(positionId, callback) {
      return this.get('users/me/portfolio/positions/' + positionId, callback);
    };

    BUX.prototype.alert = function(positionId, options, callback) {
      return this.put('users/me/portfolio/positions/' + positionId + '/alertTracker', options, callback);
    };

    BUX.prototype.alertDelete = function(positionId, callback) {
      return this.delete('users/me/portfolio/positions/' + positionId + '/alertTracker', callback);
    };

    BUX.prototype.autoclose = function(positionId, options, callback) {
      return this.put('users/me/portfolio/positions/' + positionId + '/automaticExecutionTracker', options, callback);
    };

    BUX.prototype.autocloseDelete = function(positionId, callback) {
      return this.delete('users/me/portfolio/positions/' + positionId + '/automaticExecutionTracker', callback);
    };

    BUX.prototype.trades = function(callback) {
      return this.get('users/me/trades', callback);
    };

    BUX.prototype.trade = function(tradeId, callback) {
      return this.get('users/me/trades/' + tradeId, callback);
    };

    // TODO: does not exist anymore?
    // BUX.prototype.groups = function(callback) {
    //   return this.get('users/me/groups', callback);
    // };

    // NOTE: endpoint changed
    BUX.prototype.group = function(groupId, callback) {
      return this.get('/social/16/groups/' + groupId, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupFollow = function(groupId, callback) {
      return this.put('/social/16/groups/' + groupId + '/follow', {}, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupUnfollow = function(groupId, callback) {
      return this.delete('/social/16/users/me/groups/' + groupId, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupFeed = function(groupId, callback) {
      return this.get('/social/16/groups/' + groupId + '/feed', callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupFeedCursor = function(groupId, callback) {
      return this.get('/social/16/users/me/groups/' + groupId + '/feed/cursor', callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupFeedCursorUpdate = function(groupId, lastReadFeedItemId, callback) {
      return this.put('/social/16/users/me/groups/' + groupId + '/feed/cursor/' + lastReadFeedItemId, {}, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupFeedAdd = function(groupId, message, callback) {
      return this.post('/social/16/groups/' + groupId + '/feed/chat', { message: message }, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupFeedDelete = function(groupId, messageId, callback) {
      return this.delete('/social/16/groups/' + groupId + '/feed/chat/' + messageId, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupRole = function(groupId, callback) {
      return this.get('/social/16/users/me/groups/' + groupId + '/role', callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupMemberPortfolio = function(groupId, memberId, callback) {
      return this.get('/social/16/groups/' + groupId + '/members/' + memberId + '/portfolio', callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupFollowersPreview = function(groupId, callback) {
      return this.get('/social/16/groups/' + groupId + '/followerspreview', callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupSettings = function(groupId, settings, callback) {
      return this.put('/social/16/users/me/groups/' + groupId + '/settings', settings, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.groupsAllowed = function(callback) {
      return this.get('/social/16/users/me/groups/allowed', callback);
    };

    BUX.prototype.battlesAllowed = function(callback) {
      return this.get('users/me/battles/allowed', callback);
    };

    BUX.prototype.battles = function(callback) {
      return this.get('users/me/battles', callback);
    };

    BUX.prototype.battle = function(battleId, callback) {
      return this.get('users/me/battles/' + battleId, callback);
    };

    BUX.prototype.battleCreate = function(options, callback) {
      return this.post('users/me/battles', options, callback);
    };

    BUX.prototype.battleFeed = function(battleId, callback) {
      return this.get('users/me/battles/' + battleId + '/feed', callback);
    };

    BUX.prototype.battleFeedAdd = function(battleId, message, callback) {
      return this.post('users/me/battles/' + battleId + '/feed', { message: message }, callback);
    };

    BUX.prototype.battleSettings = function(battleId, settings, callback) {
      return this.put('users/me/battles/' + battleId + '/userBattleSettings', {}, callback);
    };

    BUX.prototype.battleTemplates = function(callback) {
      return this.get('users/me/battles/templates', callback);
    };

    BUX.prototype.users = function(query, callback) {
      return this.get('search/people/', { q: query }, callback);
    };

    BUX.prototype.user = function(userId, callback) {
      return this.get('users/' + userId + '/profile', callback);
    };

    BUX.prototype.convertStatus = function(callback) {
      return this.get('convert/me', callback);
    };

    BUX.prototype.transactions = function(callback) {
      return this.get('users/me/transactions', { excludeTrades: true }, callback);
    };

    BUX.prototype.favorite = function(productId, callback) {
      var self = this;
      this.resolveProductId(productId, function(id) {
        return self.put('products/favorites/' + id, {}, callback);
      });
    };

    BUX.prototype.favoriteDelete = function(productId, callback) {
      var self = this;
      this.resolveProductId(productId, function(id) {
        return self.delete('products/favorites/' + id, callback);
      });
    };

    BUX.prototype.lock = function(callback) {
      return this.put('users/me/pincode/lock', {}, callback);
    };

    BUX.prototype.unlock = function(pincode, callback) {
      return this.put('users/me/pincode/unlock', { pincode: pincode }, callback);
    };

    BUX.prototype.lockStatus = function(callback) {
      return this.get('users/me/pincode/lock', callback);
    };

    BUX.prototype.lockReset = function(callback) {
      return this.put('users/me/pincode/reset', {}, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.activities = function(callback) {
      return this.get('/social/16/social/activities', {}, callback);
    };

    // NOTE: endpoint changed
    BUX.prototype.activitiesFollowed = function(callback) {
      return this.get('/social/16/users/me/social/activities', {}, callback);
    };

    BUX.prototype.login = function(account, callback) {
      var query, request, h;
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

      for (h in this.headers) {
        request.set(h, this.headers[h]);
      }
      request.end(function(err, res){
        if (err) { return callback(err); }

        self.config.access_token = res.body.access_token;
        self.debug('Got access token: ' + self.config.access_token);
        callback(null, res.body);
      });
    };

    // TODO: create password reset method

    // TODO: create token refresh method

    // TODO: create register method

    BUX.prototype.product = function(productId, callback) {
      var self = this;
      this.resolveProductId(productId, function(id) {
        return self.get('products/' + id, function(err, product) {
            if (!product) { return callback('product not found'); }
            if (!product.securityId) { return callback(err); }
            return callback(err, product);
        });
      });
    };

    BUX.prototype.productPriceHistory = function (productId, type, callback) {
      var self = this;

      var timespan = null;
      switch (type) {
        case 'TODAY':
          timespan = '1d';
          break;
        case 'FIVE_DAYS':
          timespan = '5d';
          break;
        case 'ONE_MONTH':
          timespan = '1M';
          break;
        case 'THREE_MONTHS':
          timespan = '3M';
          break;
        case 'SIX_MONTHS':
          timespan = '6M';
          break;
        case 'ONE_YEAR':
          timespan = '1y';
          break;
      }

      var requestOptions = {
        type: timespan
      };

      this.resolveProductId(productId, function (id) {
        return self.get('/stats/2/graph/products/' + id + '/price', requestOptions, function (err, priceHistoryData) {
          if (!priceHistoryData) {
            return callback('product not found');
          }
          if (!priceHistoryData.pricesTimeline) {
            return callback(err);
          }
          return callback(err, priceHistoryData);
        });
      });
    };

    BUX.prototype.productCandlestickHistory = function (productId, type, callback) {
      var self = this;

      var timespan = null;
      switch (type) {
        case 'TODAY':
          timespan = '5m';
          break;
        case 'ONE_MINUTE':
          timespan = '1m';
          break;
        case 'FIVE_MINUTES':
          timespan = '5m';
          break;
        case 'FIFTEEN_MINUTES':
          timespan = '15m';
          break;
        case 'ONE_HOUR':
          timespan = '1h';
          break;
        case 'ONE_DAY':
          timespan = '1d';
          break;
      }

      var requestOptions = {
        type: timespan
      };

      var timestampInMillisAtStartOfDay = new Date();
      timestampInMillisAtStartOfDay.setHours(0);
      timestampInMillisAtStartOfDay.setMinutes(0);
      timestampInMillisAtStartOfDay.setMilliseconds(0);

      if (type === 'TODAY') {
        requestOptions['start'] = timestampInMillisAtStartOfDay * 1; //cast to number
      }

      this.resolveProductId(productId, function (id) {
        return self.get('/stats/2/graph/products/' + id + '/candlestick', requestOptions, function (err, candlestickHistoryData) {
          if (!candlestickHistoryData) {
            return callback('product not found');
          }
          if (!candlestickHistoryData.length) {
            return callback(err);
          }
          return callback(err, candlestickHistoryData);
        });
      });
    };

    BUX.prototype.productAlert = function(productId, targetPrice, callback) {
      var self = this;
      this.resolveProductId(productId, function(id) {
        var amount = targetPrice.toString();
        var opts = { limit: { amount: amount, currency: '', decimals: (amount.split('.')[1] || []).length } };
        return self.put('users/me/products/' + id + '/tracker', opts, callback);
      });
    };

    BUX.prototype.productAlertDelete = function(productId, callback) {
      var self = this;
      this.resolveProductId(productId, function(id) {
        return self.delete('users/me/products/' + id + '/tracker', callback);
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

    BUX.prototype.exec = function(method, endpoint, data, callback) {
      var endpointUrl, request, h;
      var self = this;
      if (typeof data === 'function') { callback = data; }
      if (!this.config.access_token) { return callback('No access token!'); }

      endpointUrl = this.getEndpointUrl(endpoint);

      this.debug('Exec endpoint: ' + method + ' ' + endpoint);
      this.debug('Endpoint url: ' + endpointUrl);

      request = this.agent[method](endpointUrl)
        .set('Authorization', 'Bearer ' + this.config.access_token);

      for (h in this.headers) {
        request.set(h, this.headers[h]);
      }
      if (method === 'post' || method === 'put') {
        if (typeof data !== 'object') { return callback('no data'); }

        request.set('Content-Type', 'application/json; charset=UTF-8');
        request.send(data);
      }
      if (method === 'get' && typeof data === 'object') {
        request.query(data);
      }
      request.end(function(err, res) {
        if (err) {
          return callback(err);
        } else if ([ 200, 201, 202 ].indexOf(res.status) === -1) {
          return callback('endpoint not found: ' + endpointUrl);
        }

        self.debug('Got data');
        return callback(null, res.body);
      });
    };

    BUX.prototype.subscribe = function(events, callback, onReady) {
      var interval;
      var self = this;
      var finishSubscribe = function() {
        self.subscriber.ready(function() {
          self.debug('Subscribe ready: ' + JSON.stringify(events));
          if (onReady) { onReady(); }
          self.subscriber.watch(events, function(err, data) {
            if (err) { return callback(err); }
            callback(err, data.t, data.body);
          });
        });
      };

      this.debug('Subscribe: ' + JSON.stringify(events));

      if (!this.subscriber && !this.subscriberLoading) {
        this.subscriberLoading = true;
        this.subscriber = new BUXSubscriber({ endpoint: this.ws }, this);

      } else if (this.subscriberLoading) {
        interval = setInterval(function() {
          self.debug('Waiting for subscriber ..');
          if (self.subscriber && self.subscriber.ready) {
            finishSubscribe();
            clearInterval(interval);
          }
        }, 100);
        return;
      }
      finishSubscribe();
    };

    BUX.prototype.subscribeProducts = function(products, callback, onReady) {
      var self = this;
      var arr = products.map(function(p) {
        return 'product.' + self.resolveProductId(p);
      });
      this.subscribe(arr, callback, onReady);
    };

    BUX.prototype.unsubscribe = function(events, callback) {
      this.debug('Unsubscribe: ' + JSON.stringify(events));
      if(!this.subscriber) {
        return callback(null, null);
      }
      this.subscriber.updateChannels({ del: events }, function(err, done) {
        return callback(err, done);
      });
    };

    // internal methods

    BUX.prototype.getSymbols = function() {
      return this.symbols;
    };

    BUX.prototype.setSymbols = function(symbols) {
      this.symbols = symbols;
      return this.symbols;
    };

    BUX.prototype.findSymbolByProduct = function(productId) {
      return this.symbols[productId].split(',')[0];
    };

    BUX.prototype.findProductBySymbol = function(symbol, arr) {
      var curSymbols, productId, cs;
      var trimFn = function(x) { return x.trim(); };
      if (this.config.no_symbols && !arr) { return null; }
      if (!arr) { arr = this.symbols; }
      for (productId in arr) {
        curSymbols = arr[productId].split(',').map(trimFn);
        for (cs in curSymbols) {
          if (curSymbols[cs].match(new RegExp('^' + symbol.replace('@', '') + '$', 'i'))) {
            return productId;
          }
        }
      }
      return null;
    };

    BUX.prototype.resolveProductId = function(productId, callback) {
      if (!productId) {
        return callback ? callback('product not specified') : null;
      }
      var out = (this.findProductBySymbol(productId) || productId);
      if (callback) { return callback(out); }
      return out;
    };

    BUX.prototype.getServer = function() {
      return this.config.server || this.server;
    };

    BUX.prototype.getEndpointUrl = function(endpoint) {
      var addon = (endpoint.substring(0, 1) !== '/' ? '/core/17/' : '');
      return this.getServer() + addon + endpoint;
    };

    BUX.prototype.version = function() {
      return BUXVersion;
    };

    return BUX;

  })();

  const BUXSubscriber = (function() {
    BUXSubscriber.prototype.channels = [];
    BUXSubscriber.prototype.defaultChannels = [
        'portfolio.performance',
        'incentives.promotion.banner',
        'connect.connected'
    ];
    BUXSubscriber.prototype.bindings = {
      'performance': 'portfolio.performance',
      'product.@id': 'trading.product.@id',
      'position.@cmd': 'social.position.@cmd',
      'group.@cmd': 'social.group.@cmd',
      'battle.@cmd': 'social.battle.@cmd',
      'notification': 'notifications.update.v2'
    };

    function BUXSubscriber(config, api) {
      this.debug = require('debug')('libbux:subscriber');
      this.WebSocket = require('ws');
      this.config = config || {};
      this.api = api;

      // build BUXEmitter
      var EventEmitter = require('events');
      function BUXEmitter() {
        EventEmitter.call(this);
      }
      require('util').inherits(BUXEmitter, EventEmitter);
      this.emitter = new BUXEmitter();

      this.connect();
    }

    BUXSubscriber.prototype.connect = function(callback) {
      var self = this;
      var received = [];
      var options = {
        protocolVersion: 13,
        headers: Object.assign({ Authorization: 'Bearer ' + this.api.config.access_token}, this.api.headers)
      };

      this.debug('Connecting to socket: ' + this.config.endpoint);
      this.socket = new this.WebSocket(this.config.endpoint, options);
      this.socket.on('open', function(err) {
        if(err) { return callback(err); }
        setTimeout(function() {
          self.debug('Socket connected!');
          self.emitter.emit('connected');
          self.connected = true;
          if (callback) { callback(); }
        }, 0);
      });
      this.socket.on('message', function(data) {
        var decoded = JSON.parse(data);
        if (decoded.id && received.indexOf(decoded.id) !== -1) {
          self.debug('Socket GET: DUP!! ' + decoded.id);
          return null;
        }
        self.debug('Socket GET: ' + data);
        self.emitter.emit('message', decoded);
        received.push(decoded.id);
        received = received.slice(received.length - 15);
      });
      this.emitter.on('action', function(data) {
        self.debug('Socket SEND: ' + JSON.stringify(data));
        self.socket.send(new Buffer(JSON.stringify(data)), { mask: true });
      });
    };

    BUXSubscriber.prototype.ready = function(callback) {
      if (this.connected) {
        return callback();
      }
      this.emitter.once('connected', callback);
    };

    BUXSubscriber.prototype.watch = function(events, callback) {
      var self = this;
      this.updateChannels({ add: events });
      this.emitter.on('message', function(msg) {
        msg = self.reformatMessage(msg);
        var type = self.bindings[msg.t] || msg.t;
        if (events.indexOf(type) !== -1) {
          callback(null, msg);
        }
      });
    };

    BUXSubscriber.prototype.updateChannels = function(events, callback) {
      var type, ei, ev, binding, regExp;
      var self = this;
      var types = { add: 'subscribeTo', del: 'unsubscribeFrom' };
      var data = {};
      var processCountries = function(c) { return 'international.' + c + '.socialfeed'; };
      var processEvents = function (t, arr) {
        var cei, cev;
        for (cei in arr) {
          cev = arr[cei];
          if (t === 'add' && self.channels.indexOf(cev) === -1) {
            self.channels.push(cev);
            data[types[t]].push(cev);
          }
          if (t === 'del' && self.channels.indexOf(cev) !== -1) {
            self.channels.splice(self.channels.indexOf(cev), 1);
            data[types[t]].push(cev);
          }
        }
      };
      for (type in types) {
        data[types[type]] = [];
        for (ei in events[type]) {
          ev = events[type][ei];
          if (this.defaultChannels.indexOf(ev) !== -1) {
            continue;
          }
          for (binding in this.bindings) {
            regExp = new RegExp('^' + binding.replace(/(\@[a-z]+)/, '([^\.]+)') + '$');
            if (ev.match(regExp)) {
              ev = this.bindings[binding].replace(/(\@[a-z]+)/, ev.match(regExp)[1]);
            }
          }
          if (ev.match(/^social\./)) {
            processEvents(type, this.api.countries.map(processCountries));
          } else {
            processEvents(type, [ ev ]);
          }
        }
      }
      if (data[types.add].length > 0 || data[types.del].length > 0) {
        this.emitter.emit('action', data);
      }
      if (callback) { callback(null, true); }
    };

    BUXSubscriber.prototype.reformatMessage = function(msg) {
      var binding, pmsg;
      for (binding in this.bindings) {
        if (msg.t === this.bindings[binding]) {
          msg.t = binding;
        }
      }
      if (msg.t === 'trading.quote') {
        pmsg = Object.assign({}, msg);
        msg = {
          t: ('product.' + pmsg.body.securityId),
          body: pmsg.body
        };
      }
      return msg;
    };

    return BUXSubscriber;
  })();

  const BUXProductSymbols = {
    sb29388: 'AALB',           // Aalberts
    sb33038: 'ABN',            // ABN AMRO
    sb26992: 'ADS',            // Adidas
    sb26976: 'AGN',            // Aegon
    sb27687: 'ADM',            // Admiral Group
    sb26979: 'AF',             // AF - KLM
    sb28836: 'AIR',            // Airbus
    sb27892: 'AH',             // AHOLD
    sb28837: 'AKZA',           // Akzo Nobel
    sb30922: 'ALV',            // Allianz
    sb28838: 'ATC',            // Altice
    sb26977: 'MT',             // Arcelormittal
    sb27893: 'ASML',           // ASML
    sb28244: 'AZN',            // AstraZeneca
    sb26987: 'AV',             // Aviva
    sb26983: 'BARC',           // Barclays
    sb29274: 'BATS',           // BAT
    sb28245: 'BAS',            // BASF
    sb28246: 'BAYN',           // Bayer
    sb28247: 'BEI',            // Beiersdorf
    sb26988: 'BMW',            // BMW
    sb28844: 'BOKA',           // Boskalis
    sb26982: 'BP',             // BP
    sb26981: 'BT',             // BT Group
    sb28253: 'CA',             // Carrefour
    sb28254: 'BN',             // Danone
    sb30934: 'CBK',            // Commerzbank
    sb26989: 'DAI',            // Daimler
    sb28248: 'DBK',            // Deutsche Bank
    sb30931: 'DB1',            // Deutsche Boerse
    sb30928: 'DPW',            // Deutsche Post
    sb30924: 'DTE',            // Deutsche Telekom
    sb28848: 'DL',             // Delta Lloyd
    sb27902: 'DGE',            // Diageo
    sb27690: 'DC',             // Dixons
    sb28859: 'DSM',            // DSM
    sb30923: 'EOAN',           // E.ON
    sb27903: 'EZJ',            // Easyjet
    sb27897: 'FUR',            // FUGRO
    sb30927: 'FME',            // Fresenius Med
    sb30929: 'FRE',            // Fresenius
    sb28243: 'GSK',            // GlaxoSmithKline
    sb28851: 'GTO',            // Gemalto
    sb27905: 'GLEN',           // Glencore
    sb28855: 'ITX',            // Inditex
    sb30932: 'IFX',            // Infineon
    sb26975: 'INGA',           // ING
    sb30936: 'HEI',            // Heidelbergcement
    sb26974: 'HEIA',           // Heineken
    sb30930: 'HEN',            // Henkel
    sb28852: 'HMB6F',          // H&M
    sb26509: 'HSBA',           // HSBC
    sb30933: 'SDF',            // K+S
    sb27906: 'KGF',            // Kingfisher
    sb28858: 'LOIM',           // Klepierre
    sb26506: 'KPN',            // KPN
    sb29276: 'LLOY',           // Lloyds Banking
    sb28249: 'LHA',            // Lufthansa
    sb30937: 'LXS',            // Lanxess
    sb30925: 'LIN',            // Linde
    sb26991: 'OR',             // L'Oreal
    sb26990: 'MC',             // Louis Vuitton
    sb26986: 'MKS',            // Marks & Spencer
    sb30935: 'MRK.DE',         // Merck DE
    sb29389: 'NN',             // NN Group
    sb28256: 'RI',             // Pernod-Ricard
    sb33058: 'PEU',            // Peugeot
    sb26533: 'RDSA',           // Shell
    sb26978: 'PHI',            // Philips
    sb27894: 'RAND',           // Randstad
    sb29391: 'REN',            // Reed Elsevier
    sb26994: 'RNL',            // Renault
    sb27908: 'RIO',            // Rio Tinto
    sb26985: 'RBS',            // RBS
    sb27907: 'RR',             // Rolls Royce
    sb30926: 'RWEG',           // RWE
    sb26984: 'SBRY',           // Sainsbury's
    sb28252: 'SAP',            // SAP
    sb26980: 'SBMO',           // SBM Offshore
    sb28250: 'SIE',            // Siemens
    sb29277: 'SL',             // Standard Life
    sb26995: 'TFA',            // Telefonica
    sb28722: 'TOM2',           // TomTom
    sb26510: 'TSCO',           // Tesco
    sb28251: 'TKA',            // Thyssenkrupp
    sb27910: 'TT',             // TUI Travel
    sb28872: 'UL',             // Unibail
    sb27896: 'UNIA',           // UNILEVER
    sb28255: 'VVU',            // Vivendi
    sb26508: 'VOD',            // Vodafone
    sb26993: 'VOW',            // Volkswagen
    sb29390: 'VPK',            // Vopak
    sb27688: 'WEIR',           // Weir Group
    sb27686: 'SMWH',           // WH Smith
    sb28875: 'WKL',            // Wolters Kluwer
    sb27715: 'ZAL',            // Zalando
    sb27693: 'ANF',            // Abercrombie
    sb28205: 'ATVI',           // Activision
    sb28231: 'AA',             // ALCOA
    sb27692: 'BABA',           // Alibaba
    sb26998: 'AMZN',           // Amazon
    sb28839: 'AMGN',           // Amgen
    sb26513: 'AAPL',           // Apple
    sb28840: 'T',              // AT&T
    sb27886: 'BIDU',           // Baidu
    sb28842: 'BRK',            // Berkshire Hathaway
    sb28138: 'BBRY',           // Blackberry
    sb28841: 'BAC',            // Bank of America
    sb28843: 'BLK',            // Blackrock
    sb27695: 'BA',             // Boeing
    sb28845: 'CELG',           // Celgene
    sb28233: 'CVX',            // Chevron
    sb28210: 'CSCO',           // Cisco Systems
    sb28220: 'KO',             // Coca-Cola
    sb28847: 'DAL',            // Delta Air Lines
    sb28849: 'ETFC',           // E*Trade
    sb28207: 'EBAY',           // Ebay
    sb28211: 'EXPE',           // Expedia
    sb28226: 'XOM',            // Exxon Mobil
    sb26511: 'FB',             // Facebook
    sb28221: 'F',              // Ford Motor Co.
    sb32727: 'RACE',           // Ferrari
    sb28212: 'FOSL',           // Fossil Group
    sb32256: 'FIT',            // Fitbit
    sb28850: 'GRMN',           // Garmin
    sb28222: 'GE',             // General Electric
    sb28224: 'GM',             // General Motors
    sb27001: 'GS',             // Goldman Sachs
    sb26514: 'GOOG',           // Google
    sb27701: 'GPRO',           // GoPro
    sb28236: 'HAL',            // Halliburton
    sb28235: 'HOG',            // Harley-Davidson
    sb28213: 'HAS',            // Hasbro
    sb28853: 'HPQ',            // HP Inc
    sb28856: 'IBM',            // IBM
    sb28854: 'ILMN',           // Illumina
    sb28209: 'INTC',           // Intel
    sb28857: 'JPM',            // JPMorgan Chase
    sb28214: 'KHC',            // Kraft-Heinz
    sb29275: 'LBTYA',          // Liberty Global
    sb28229: 'MCD',            // McDonald's
    sb28230: 'MRK',            // Merck
    sb26999: 'MSFT',           // Microsoft
    sb28860: 'MON',            // Monsanto
    sb28861: 'MNST',           // Monster
    sb28862: 'MS',             // Morgan Stanley
    sb28219: 'NKE',            // Nike
    sb27002: 'NFLX',           // Netflix
    sb33059: 'NVDA',           // Nvidia Corp
    sb28864: 'ORCL',           // Oracle
    sb30581: 'PYPL',           // PayPal
    sb28238: 'PEP',            // Pepsico
    sb28223: 'PFE',            // Pfizer
    sb28865: 'PM',             // Philip Morris
    sb27003: 'PCLN',           // Priceline
    sb28228: 'PG',             // Procter Gamble
    sb28206: 'QCOM',           // Qualcomm
    sb28239: 'RL',             // Ralph Lauren
    sb28240: 'CRM',            // Salesforce
    sb28227: 'SLB',            // Schlumberger
    sb28867: 'SCHW',           // Schwab
    sb28216: 'SBUX',           // Starbucks
    sb26515: 'TSLA',           // Tesla Motors
    sb28868: 'TWC',            // Time Warner
    sb28870: 'FOXA',           // 21st Century Fox
    sb28217: 'TRIP',           // Tripadvisor
    sb26512: 'TWTR',           // Twitter
    sb28871: 'UA',             // Under Armour
    sb28873: 'VZ',             // Verizon
    sb28232: 'WMT',            // Wal-Mart
    sb27694: 'DIS',            // Walt Disney
    sb30938: 'V',              // Visa
    sb28874: 'WFM',            // Whole Foods
    sb28876: 'XRX',            // Xerox
    sb27000: 'YHOO',           // Yahoo!
    sb28242: 'YUM',            // YUM
    sb26996: 'ZNGA',           // Zynga
    sb26493: 'DAX,DE30',       // Germany 30
    sb26492: 'CAC,FR40',       // France 40
    sb26491: 'AEX,NL25',       // NL 25
    sb26494: 'IBEX,ES35',      // Spain 35
    sb26495: 'FTSE,UK100',     // UK 100
    sb26496: 'SPX,US500',      // US 500
    sb26497: 'NQ,US100',       // US Tech 100
    sb26498: 'DJI,US30',       // Wallstreet 30
    sb26500: 'GC,XAU',         // Gold
    sb26501: 'SI,XAG',         // Silver
    sb33060: 'PT,XPT',         // Platinum
    sb28258: 'EURCAD',         // EUR/CAD
    sb32391: 'EURCHF',         // EUR/CHF
    sb26502: 'EURUSD',         // EUR/USD
    sb26504: 'EURGBP',         // EUR/GBP
    sb28257: 'EURJPY',         // EUR/JPY
    sb28262: 'GBPCAD',         // GBP/CAD
    sb32393: 'GBPCHF',         // GBP/CHF
    sb28261: 'GBPJPY',         // GBP/JPY
    sb26503: 'GBPUSD',         // GBP/USD
    sb28260: 'USDCAD',         // USD/CAD
    sb32392: 'USDCHF',         // USD/CHF
    sb28259: 'USDJPY',         // USD/JPY
    sb34064: 'AUDUSD',         // AUD/USD
    sb34066: 'EURAUD',         // EUR/AUD
    sb34067: 'GBPAUD',         // GBP/AUD
    sb34065: 'NZDUSD',         // NZD/USD
    sb34068: 'EURNZD',         // EUR/NZD
    sb34069: 'GBPNZD',         // GBP/NZD

    // TODO: not sure which symbols to use here
    sb34087: 'PSM.DE',         // ProSieben
    sb34080: 'BA.L',               // BAE Systems
    sb32395: 'SZUG.DE',        // Suedzucker
    sb32394: 'VNA.MI',               // Vonovia
    sb34799: 'ADBE',          // Adobe Systems
    sb34271: 'C',             // Citigroup
    sb34085: 'FCAU',          // Fiat Chrysler
    sb36392: 'OIL'            // US Oil 19 Jan 17
  };

  module.exports = {
    BUX: BUX,
    symbols: BUXProductSymbols,
    version: BUXVersion,
    api: function(config, callback) {
      var bux = new BUX(config);
      bux.setSymbols(BUXProductSymbols);
      if (callback) { callback(bux); }
      return bux;
    }
  };

}).call(this);
