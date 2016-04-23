// --------------------------------------------------------
// Install 'async' library: npm install async
// --------------------------------------------------------
var async = require('async');
var request = require('superagent');
var qs = require('querystring');

// --------------------------------------------------------
// Create '.bux-config.json' file in your $HOME directory:
// { "account": { "access_token": "YOUR_TOKEN" }}
// --------------------------------------------------------
var token = JSON.parse(require('fs').readFileSync(process.env.HOME + '/.bux-config.json')).account.access_token;

const stockCurrencies = {
  STU: 'EUR',
  NYQ: 'USD',
  NMS: 'USD',
  MEX: 'MXN',
  FRA: 'EUR',
  DUS: 'EUR',
  AMS: 'EUR',
  LSE: 'GBP',
  PAR: 'EUR',
  MCE: 'EUR',
  STO: 'SEK',
  BER: 'EUR',
  HKG: 'HKD',
  TOR: 'CAD',
  EBS: 'CHF',
  MUN: 'EUR',
  HAM: 'EUR',

  // ignored
  EUX: 'XXX',
  PCX: 'XXX',
  PNK: 'XXX'
};

const fixedSymbols = {
  'sb26977': 'MT',
  'sb26979': 'AF',
  'sb26991': 'OR',
  'sb30935': 'MRK.DE',
  'sb29391': 'REN',
  'sb26984': 'SBRY',
  'sb27910': 'TT',
  'sb29390': 'VPK',
  'sb28214': 'KHC',
  'sb28229': 'MCD',
  'sb28228': 'PG',
  'sb28870': 'FOXA',
  'sb26514': 'GOOG',
  'sb30931': 'DB1',
  'sb29274': 'BATS',
  'sb28246': 'BAYN',
  'sb28842': 'BRK',
  'sb26978': 'PHI',

  'sb27702': 'BEL,BE20',
  'sb26493': 'DAX,DE30',
  'sb26492': 'CAC,FR40',
  'sb26491': 'AEX,NL25',
  'sb26494': 'IBEX,ES35',
  'sb26495': 'FTSE,UK100',
  'sb26496': 'SPX,US500',
  'sb26497': 'NQ,US100', // nasdaq 100
  'sb26498': 'DJI,US30', // dow jones

  'sb26500': 'GC,XAU',
  'sb26501': 'SI,XAG',
  'sb33060': 'PT,XPT',
  'sb33927': 'OIL', // oil
}

var markets = {};

function getSymbol(p, callback) {

  function setFixed(symbol) {
    console.log(p.securityId + ': ' + symbol + ' (' + p.displayName + ',' + p.symbol + ') '+p.quoteCurrency+' fixed');
    return callback(symbol);
  }
  if (p.category == 'FOREX') {
    return setFixed(p.displayName.replace(/\//, ''));
  }
  if (fixedSymbols[p.securityId]) {
    return setFixed(fixedSymbols[p.securityId]);
  }
  var url = 'http://autoc.finance.yahoo.com/autoc?query=' + qs.escape(p.displayName) + '&region=1&lang=en';
  request.get(url).end(function(err, res){
    var cr, symbol;
    for (var i in res.body.ResultSet.Result) {
      cr = res.body.ResultSet.Result[i]
      if (stockCurrencies[cr.exch] && stockCurrencies[cr.exch] != p.quoteCurrency) {
        continue;
      }
      symbol = cr.symbol.match(/^([^\.]+)/)[1];
      break;
    }
    if(!symbol) {
      console.log('Symbol not found: ' + p.securityId + ' ' + p.displayName + ' Currency: '+p.quoteCurrency);
      process.exit();
      return callback(null);
    }

    if (!markets[cr.exch]) markets[cr.exch] = 0;

    markets[cr.exch]++;
    console.log(p.securityId + ': ' + symbol + ' (' + p.displayName + ',' + p.symbol + ') '+p.quoteCurrency+' found exch='+cr.exch);
    callback(symbol);
  });
}

function fixLength(str, len) {
  str = '\''+str+'\''
  if (str.length > len) return str+',';
  var diff = len - str.length;
  return str + ',' + (" ").repeat(diff);
}

var BUX = require('..');
var bux = new BUX.api({ access_token: token, server: 'localhost:7878' });

var output = {}

bux.products(function(err, data) {
  console.log('Total products: ' + data.length);

  async.eachSeries(data.slice(0,250), function(p, next) {
    getSymbol(p, function(symbol) {
      output[p.securityId] = { product: p, symbol: symbol };
      setTimeout(next, 100);
    });

  }, function() {
    var usedSymbols = [];
    var maxLength = 0;
    var k, cs, isLast;
    // check dupes
    for (k in output) {
      cs = output[k];
      if (usedSymbols.indexOf(cs.symbol) !== -1) {
        console.log('dupe symbol!!: '+JSON.stringify(cs));
        process.exit();
      }
      if (cs.symbol.length > maxLength) {
        maxLength = cs.symbol.length;
      }
      usedSymbols.push(cs.symbol);
    }

    console.log(JSON.stringify(markets, null, 2));

    console.log('  const BUXProductSymbols = {');
    for (k in output) {
      cs = output[k];
      console.log("    %s: %s // %s", cs.product.securityId, fixLength(cs.symbol, maxLength+6), cs.product.displayName);
    }
    console.log('  };');
  })
});

