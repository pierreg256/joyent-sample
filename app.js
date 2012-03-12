
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , eaHelp = require('./lib/eaHelper')
  , util = require('util');
  //, db = require('./lib/database');

var app = module.exports = express.createServer();

// Configuration
eaHelp.helpExpress(app);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'N0deJSRocks!' }));
  app.use(eaHelp.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);


//console.log(util.inspect(app));
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
