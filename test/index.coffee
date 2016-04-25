BUX = require '../'
MockServer = require '../spec/mock-server.coffee'
yaml = require 'js-yaml'
assert = require('chai').assert
Path = require 'path'
fs = require 'fs'

specVersion = 'v13'

spec = yaml.load fs.readFileSync(Path.resolve(__dirname, "../spec/#{specVersion}/endpoints.yaml"))
#token = JSON.parse(fs.readFileSync(process.env.HOME + '/.bux-config.json')).account.access_token;
token = 'TEST-TOKEN'

bux = null
mockServerPort = 7890
mockServerAddress = "localhost:#{mockServerPort}"

getBUX = ->
  return new BUX.api { server: mockServerAddress, access_token: token }

describe 'libbux', ->

  before ->
    server = new MockServer specVersion, mockServerPort
    server.start (env) ->

  describe 'main', ->

    it 'api load', ->
      bux = getBUX()
      assert.equal bux.version(), BUX.version

  describe 'internal methods', ->

    it 'version', ->
      assert.equal bux.version(), BUX.version

    it 'getServer', ->
      assert.equal bux.getServer(), mockServerAddress

    it 'getEndpointUrl', ->
      assert.equal bux.getEndpointUrl('users/me'), "#{mockServerAddress}/core/13/users/me"

    it 'getSymbols', ->
      assert.deepEqual bux.getSymbols(), BUX.symbols

    it 'setSymbols', ->
      testSymbols = { 'sbXXX': 'TSTSTCK' }
      testBux = getBUX()
      testBux.setSymbols testSymbols
      assert.deepEqual testBux.getSymbols(), testSymbols

    it 'findSymbolByProduct', ->
      assert.equal bux.findSymbolByProduct(spec.examples.product), spec.examples.product_symbol

    it 'findProductBySymbol', ->
      assert.equal bux.findProductBySymbol(spec.examples.product_symbol), spec.examples.product

  describe 'public methods', ->

    it 'exec', (done) ->
      bux.exec 'get', 'users/me', (err, data) ->
        assert.equal err, null
        assert.equal data.nickname, 'burningtree'
        done()

    it 'login', (done) ->
      bux.login { 'email': 'xxx@example.org', 'password': 'PASSWORD' }, (err, data) ->
        assert.equal err, null
        assert.equal data.access_token, 'xxxxx'
        done()

    it 'me', (done) ->
      bux.me (err, data) ->
        assert.equal err, null
        assert.equal data.id, spec.examples.me_id
        done()

    it 'profile', (done) ->
      bux.profile (err, data) ->
        assert.equal err, null
        assert.equal data.tradingStats.totalTrades, spec.examples.profile_totaltrades
        done()

    it 'friends', (done) ->
      bux.friends (err, data) ->
        assert.equal err, null
        assert.equal data[0].nickname, spec.examples.friends_first
        done()

    it 'notifications', (done) ->
      bux.notifications (err, data) ->
        assert.equal err, null
        assert.equal data[1].id, spec.examples.notifications_second_id
        done()

    it 'news', (done) ->
      bux.news (err, data) ->
        assert.equal err, null
        assert.equal data.headlines[0].title, spec.examples.news_first_title
        done()

    it 'feed', (done) ->
      bux.feed (err, data) ->
        assert.equal err, null
        assert.equal data.recentEvents[0].t, spec.examples.feed_first_type
        done()

    it 'product', (done) ->
      bux.product spec.examples.product, (err, data) ->
        assert.equal err, null
        assert.equal data.securityId, spec.examples.product
        done()

    it 'products', (done) ->
      bux.products (err, data) ->
        assert.equal err, null
        assert.equal data[0].securityId, spec.examples.products_first_security
        done()

    it 'fees', (done) ->
      bux.fees (err, data) ->
        assert.equal err, null
        assert.equal data.feeSchedules[0].productCategory, spec.examples.fees_first_category
        done()

    it 'portfolio', (done) ->
      bux.portfolio (err, data) ->
        assert.equal err, null
        assert.equal data.positions[0].product.displayName, spec.examples.portfolio_firstposition_productname
        done()

    it 'position', (done) ->
      bux.position spec.examples.position, (err, data) ->
        assert.equal err, null
        assert.equal data.product.displayName, spec.examples.position_product_name
        done()

    it 'performance', (done) ->
      bux.performance (err, data) ->
        assert.equal err, null
        assert.equal data.accountValue.amount, spec.examples.performance_account_amount
        done()

    it 'balance', (done) ->
      bux.balance (err, data) ->
        assert.equal err, null
        assert.equal data.availableCashForWithdrawal.amount, 0
        done()

    it 'trades', (done) ->
      bux.trades (err, data) ->
        assert.equal err, null
        assert.equal data[0].dateCreated, spec.examples.trades_first_created
        done()

    it 'open', (done) ->
      trade =
        product: 'sb27701'
        direction: 'BUY'
        size: 10
        multiplier: 5

      bux.open trade, (err, data) ->
        assert.equal err, null
        assert.equal data.type, 'OPEN'
        assert.equal data.product.securityId, trade.product 
        assert.equal data.direction, trade.direction
        assert.equal data.leverage, trade.multiplier
        assert.equal data.investingAmount.amount, trade.size
        done()

    it 'close', (done) ->
      bux.close spec.examples.position, (err, data) ->
        assert.equal err, null
        assert.equal data.positionId, spec.examples.position
        assert.equal data.type, 'CLOSE'
        done()

