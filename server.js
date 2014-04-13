'use strict';

var express       = require('express');
var exoress_res   = require('express-resource')
var http          = require("http");
var path          = require('path');

var orm           = require('thin-orm');
var pg            = require('pg');
var db            = new sqlite3.Database('guano.db');
var driver        = orm.createDriver('sqlite', { db: db });
var portsClient   = require("./lib/ports.js")(driver);

var app  = express();
var port = process.env.PORT || 3000;

app.use(express.logger());
app.use(express.compress());

var pub_dirs = ['components', 'images', 'styles', 'scripts', 'templates'];
pub_dirs.forEach(function (dir) {
  app.use('/' + dir, express.static(path.join(__dirname, 'app', dir)));
});

app.use(express.bodyParser());
app.use(express.basicAuth('admin', 'batman2'));

app.get(/^\/(.+\.html)?$/, function (req, res) {
  res.sendfile(path.join(__dirname, 'app', "index.html"));
});

app.use(app.router);
app.resource('ports', portsClient);

http.createServer(app).listen(port, function () {
  console.log('Express server listening on port ' + port);
});

/* vim: set ts=2 sw=2: */
