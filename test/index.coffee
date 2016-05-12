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
        assert.equal data.nickname, spec.examples.username
        done()

    it 'login', (done) ->
      bux.login { 'email': 'xxx@example.org', 'password': 'PASSWORD' }, (err, data) ->
        assert.equal err, null
        assert.equal data.access_token, 'xxxxx'
        done()

    it 'me', (done) ->
      bux.me (err, data) ->
        assert.equal err, null
        assert.equal data.id, spec.examples.user
        done()

    it 'profile', (done) ->
      bux.profile (err, data) ->
        assert.equal err, null
        assert.isAbove data.tradingStats.totalTrades, 0
        done()

    it 'friends', (done) ->
      bux.friends (err, data) ->
        assert.equal err, null
        assert.equal data[0].nickname, spec.examples.friends_first
        done()

    it 'users', (done) ->
      bux.users spec.endpoints['search/people/'].GET.query.q, (err, data) ->
        assert.equal err, null
        assert.equal data[0].id, spec.examples.anotherUser
        done()

    it 'user', (done) ->
      bux.user spec.examples.anotherUser, (err, data) ->
        assert.equal err, null
        assert.equal data.id, spec.examples.anotherUser
        done()

    it 'notifications', (done) ->
      bux.notifications (err, data) ->
        assert.equal err, null
        assert.equal data[1].id, spec.examples.notifications_second_id
        done()

    it 'news', (done) ->
      bux.news (err, data) ->
        assert.equal err, null
        assert.isAbove data.headlines.length, 0
        done()

    it 'feed', (done) ->
      bux.feed (err, data) ->
        assert.equal err, null
        assert.equal data.recentEvents[0].t, spec.examples.feed_first_type
        done()

    it 'products', (done) ->
      bux.products (err, data) ->
        assert.equal err, null
        assert.equal data[0].securityId, spec.examples.products_first_security
        done()

    it 'product', (done) ->
      bux.product spec.examples.product, (err, data) ->
        assert.equal err, null
        assert.equal data.securityId, spec.examples.product
        done()

    it 'productAlert', (done) ->
      opts = spec.endpoints['users/me/products/@product/tracker'].PUT.data
      bux.productAlert spec.examples.product, opts.limit.amount, (err, data) ->
        assert.equal err, null
        assert.equal data.limit.amount, opts.limit.amount
        done()

    it 'productAlertDelete', (done) ->
      bux.productAlertDelete spec.examples.product, (err, data) ->
        assert.equal err, null
        assert.isOk data
        done()

    it 'favorite', (done) ->
      bux.favorite spec.examples.product, (err, data) ->
        assert.equal err, null
        assert.isOk data
        done()

    it 'favoriteDelete', (done) ->
      bux.favoriteDelete spec.examples.product, (err, data) ->
        assert.equal err, null
        assert.isOk data
        done()

    it 'fees', (done) ->
      bux.fees (err, data) ->
        assert.equal err, null
        assert.equal data.feeSchedules[0].productCategory, spec.examples.fees_first_category
        done()

    it 'portfolio', (done) ->
      bux.portfolio (err, data) ->
        assert.equal err, null
        assert.equal data.positions[0].product.displayName, spec.examples.position_product_name
        done()

    it 'position', (done) ->
      bux.position spec.examples.position, (err, data) ->
        assert.equal err, null
        assert.equal data.product.displayName, spec.examples.position_product_name
        done()

    it 'alert', (done) ->
      opts = spec.endpoints['users/me/portfolio/positions/@position/alertTracker'].PUT.data
      bux.alert spec.examples.position, opts, (err, data) ->
        assert.equal err, null
        assert.equal data.upperLimit, opts.upperLimit
        done()

    it 'alertDelete', (done) ->
      bux.alertDelete spec.examples.position, (err, data) ->
        assert.equal err, null
        done()

    it 'autoclose', (done) ->
      opts = spec.endpoints['users/me/portfolio/positions/@position/automaticExecutionTracker'].PUT.data
      bux.autoclose spec.examples.position, opts, (err, data) ->
        assert.equal err, null
        assert.equal data.upperLimit, opts.upperLimit
        done()

    it 'autocloseDelete', (done) ->
      bux.autocloseDelete spec.examples.position, (err, data) ->
        assert.equal err, null
        done()

    it 'performance', (done) ->
      bux.performance (err, data) ->
        assert.equal err, null
        assert.isAbove data.accountValue.amount, 0
        done()

    it 'balance', (done) ->
      bux.balance (err, data) ->
        assert.equal err, null
        assert.equal data.availableCashForWithdrawal.amount, 0
        done()

    it 'trades', (done) ->
      bux.trades (err, data) ->
        assert.equal err, null
        assert.equal data[0].type, 'OPEN'
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

    it 'groups', (done) ->
      bux.groups (err, data) ->
        assert.equal err, null
        assert.equal data.participating[0].id, spec.examples.group
        done()

    it 'group', (done) ->
      bux.group spec.examples.group, (err, data) ->
        assert.equal err, null
        assert.equal data.type, 'PRIVATE'
        done()

    it 'groupFollow', (done) ->
      bux.groupFollow spec.examples.publicGroup, (err, data) ->
        assert.equal err, null
        done()

    it 'groupUnfollow', (done) ->
      bux.groupUnfollow spec.examples.publicGroup, (err, data) ->
        assert.equal err, null
        done()

    it 'groupFeed', (done) ->
      bux.groupFeed spec.examples.group, (err, data) ->
        assert.equal err, null
        assert.isAbove data.totalItemCount, 0
        done()

    it 'groupFeedCursor', (done) ->
      bux.groupFeedCursor spec.examples.group, (err, data) ->
        assert.equal err, null
        assert.isOk data.lastReadFeedItemId
        done()

    it 'groupFeedCursorUpdate', (done) ->
      bux.groupFeedCursorUpdate spec.examples.group, spec.examples.lastReadFeedItemId, (err, data) ->
        assert.equal err, null
        assert.equal data.lastReadFeedItemId, spec.examples.lastReadFeedItemId
        done()

    it 'groupFeedAdd', (done) ->
      bux.groupFeedAdd spec.examples.group, 'Test message', (err, data) ->
        assert.equal err, null
        done()

    it 'groupFeedDelete', (done) ->
      bux.groupFeedDelete spec.examples.group, spec.examples.messageId, (err, data) ->
        assert.equal err, null
        assert.equal data.body.deleted, true
        done()

    it 'groupRole', (done) ->
      bux.groupRole spec.examples.group, (err, data) ->
        assert.equal err, null
        assert.equal data.role, 'MEMBER'
        done()

    it 'groupMemberPortfolio', (done) ->
      bux.groupMemberPortfolio spec.examples.group, spec.examples.user, (err, data) ->
        assert.equal err, null
        assert.isAbove data.positionCount, 0
        done()

    it 'groupFollowersPreview', (done) ->
      bux.groupFollowersPreview spec.examples.group, (err, data) ->
        assert.equal err, null
        assert.equal data.errorCode, 'CORE_038'
        done()

    it 'groupSettings', (done) ->
      bux.groupSettings spec.examples.group, spec.endpoints['users/me/groups/@group/settings'].PUT.data, (err, data) ->
        assert.equal err, null
        assert.equal data.muted, true
        done()

    it 'groupsAllowed', (done) ->
      bux.groupsAllowed (err, data) ->
        assert.equal err, null
        assert.equal data.errorCode, 'CORE_038'
        done()

    it 'battles', (done) ->
      bux.battles (err, data) ->
        assert.equal err, null
        assert.isAbove data.battles.length, -1
        done()

    it 'battlesAllowed', (done) ->
      bux.battlesAllowed (err, data) ->
        assert.equal err, null
        assert.isOk data
        done()

    it 'battle', (done) ->
      bux.battle spec.examples.battle, (err, data) ->
        assert.equal err, null
        assert.equal data.creator.nickname, spec.examples.username
        done()

    it 'battleCreate', (done) ->
      opts = spec.endpoints['users/me/battles'].POST.data
      bux.battleCreate opts, (err, data) ->
        assert.equal err, null
        assert.equal data.name, opts.battleName
        assert.equal data.status, 'CREATED'
        done()

    it 'battleFeed', (done) ->
      bux.battleFeed spec.examples.battle, (err, data) ->
        assert.equal err, null
        assert.isAbove data.recentEvents.length, -1
        done()

    it 'battleFeedAdd', (done) ->
      opts = spec.endpoints['users/me/battles/@battle/feed'].POST.data
      bux.battleFeedAdd spec.examples.battle, opts.message, (err, data) ->
        assert.equal err, null
        assert.isOk data
        done()

    it 'battleSettings', (done) ->
      opts = spec.endpoints['users/me/battles/@battle/userBattleSettings'].PUT.data
      bux.battleSettings spec.examples.battle, opts, (err, data) ->
        assert.equal err, null
        assert.equal data.muted, true
        done()

    it 'battleTemplates', (done) ->
      bux.battleTemplates (err, data) ->
        assert.equal err, null
        assert.isAbove data.templates.length, 1
        done()

