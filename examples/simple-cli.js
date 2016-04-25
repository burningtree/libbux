// --------------------------------------------------------
// Create '.bux-config.json' file in your $HOME directory:
// { "account": { "access_token": "YOUR_TOKEN" }}
// --------------------------------------------------------
var token = JSON.parse(require('fs').readFileSync(process.env.HOME + '/.bux-config.json')).account.access_token;

var BUX = require('..');
var bux = new BUX.api({ access_token: token });

// enable debugging
process.env.DEBUG = 'libbux:*'

auth = { email: 'USERNAME', password: 'PASSWORD' }
methods = {};

methods.product = function(arg) {
  bux.product(arg, function(err, output) {
    if(err) { throw Error(err); }
    console.log(JSON.stringify(output, null, 2));
  });
};

methods.portfolio = function() {
  bux.portfolio(function(err, output) {
    if(err) { throw Error(err); }
    console.log(JSON.stringify(output, null, 2));
  });
}

methods.notifications = function() {
  bux.notifications(function(err, output) {
    if(err) { throw Error(err); }
    console.log(JSON.stringify(output, null, 2));
  });
}

methods.login = function() {
  bux.login(auth, function(err, output) {
    if(err) { throw Error(err); }
    console.log(JSON.stringify(output, null, 2));
  });
}

methods[process.argv[2]](process.argv[3])
