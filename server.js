'use strict';

var express       = require('express');
var passport      = require('passport');
var http          = require("http");
var path          = require('path');
var BasicStrategy = require('passport-http').BasicStrategy;

var app  = express();
var port = process.env.PORT || 3000;

function findByUsername(username, f) {
    if (username == 'admin') {
        f(null, { password: "batman" });
    }
    else {
        f("invalid username", null);
    }
}

passport.use(new BasicStrategy({},
  function (username, password, done) {
    // Find the user by username. If there is no user with the given
    // username, or the password is not correct, set the user to `false` to
    // indicate failure. Otherwise, return the authenticated `user`.
    findByUsername(username, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    })
  }
));

app.configure(function () {
  var pub_dirs = ['components', 'images', 'styles', 'scripts', 'templates'];
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.session({secret: "agent man"}));
  app.use(passport.initialize());
  app.use(passport.session({
    secret: "agent man"
  }));

  pub_dirs.forEach(function (dir) {
    app.use('/' + dir, express.static(path.join(__dirname, 'app', dir)));
  });

  app.use(app.router);
});

app.get('/',
  passport.authenticate('basic', { session: false }),
  function (req, res) {
    res.sendfile(path.join(__dirname, 'app', "index.html"));
  });

http.createServer(app).listen(port, function(){
    console.log('Express server listening on port ' + port);
});
