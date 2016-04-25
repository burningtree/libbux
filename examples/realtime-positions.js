// --------------------------------------------------------
// Create '.bux-config.json' file in your $HOME directory:
// { "account": { "access_token": "YOUR_TOKEN" }}
// --------------------------------------------------------
var token = JSON.parse(require('fs').readFileSync(process.env.HOME + '/.bux-config.json')).account.access_token;

var BUX = require('..');
var bux = new BUX.api({ access_token: token });

bux.subscribe(['position.opened'], function(res, type, data) {
  console.log('Position opened: type=%s, stock=%s, user=%s [%s]', data.position.type, data.position.product.displayName, data.user.nickname, data.user.countryCode);
}, function() {
  console.log('Waiting for opened positions ..');
});

