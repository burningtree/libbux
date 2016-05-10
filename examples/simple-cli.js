// --------------------------------------------------------
// Create '.bux-config.json' file in your $HOME directory:
// { "account": { "access_token": "YOUR_TOKEN" }}
// --------------------------------------------------------
var token = JSON.parse(require('fs').readFileSync(process.env.HOME + '/.bux-config.json')).account.access_token;

// enable debugging
process.env.DEBUG = 'libbux:*'

// initialize BUX
var BUX = require('..');
var bux = new BUX.api({ access_token: token });

auth = { email: 'USERNAME', password: 'PASSWORD' }
methods = {};

var runAPI = function(method, arg) {
  // process arguments
  var args = Array.prototype.slice.call(arguments)
    .filter(function(x) { return x !== undefined })
    .map(function(x) { if(x.match(/^\{/)) { return JSON.parse(x); }; return x; });

  // set method
  var method = args.shift();

  // callback handler
  args.push(function(err, output) {
    if(err) { throw Error(err); }
    console.log(JSON.stringify(output, null, 2));
  });

  // call api
  bux[method].apply(bux, args);
};

runAPI(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
