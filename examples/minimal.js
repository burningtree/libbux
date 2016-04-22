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

    // Traverse positions and print your current profits
    for (var pos in data.positions) {
      var p = data.positions[pos];
      console.log('%s .. %s', p.product.displayName, p.profitAndLoss.amount);
    }
  });
});
