var BUX = require('..');

process.env.DEBUG = 'libbux:*'

var bux = new BUX.api();

auth = { email: 'USERNAME', password: 'PASSWORD' }
methods = {};

methods.product = function(arg) {
  bux.login(auth, function(err) {
    if(err) { throw Error(err); }

    bux.product(arg, function(err, output) {
      if(err) { throw Error(err); }
      console.log(JSON.stringify(output, null, 2));
    });
  });
};

methods.portfolio = function() {
  bux.login(auth, function(err) {
    if(err) { throw Error(err); }

    bux.get('users/me/portfolio', function(err, output) {
      if(err) { throw Error(err); }
      console.log(JSON.stringify(output, null, 2));
    });
  });
}

methods.login = function() {
  bux.login(auth, function(err, output) {
    if(err) { throw Error(err); }
    console.log(JSON.stringify(output, null, 2));
  });
}

methods[process.argv[2]](process.argv[3])
