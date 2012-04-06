
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , APIroutes = require('./lib/API')
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
app.get('/users/:user_id/trips.html', routes.details);

// API Routes
app.get('/api/users/:userid', APIroutes.APIUsers.authenticate, APIroutes.APIUsers.get);
app.put('/api/users/:userid', APIroutes.APIUsers.authenticate, APIroutes.APIUsers.put);
app.post('/api/users/:userid', APIroutes.APIUsers.post);
app.get('/api/my/identity', APIroutes.APIUsers.authenticate, APIroutes.APIUsers.identity)

app.post('/api/moves', APIroutes.APIUsers.authenticate, APIroutes.APIMoves.post);

app.get('/api/moves', APIroutes.APIUsers.authenticate, APIroutes.APIMoves.get);
app.get('/api/users/:userid/moves', APIroutes.APIUsers.authenticate, APIroutes.APIMoves.get);



app.put(/\/.*/, function (req, res, next){
  console.log('PUT: ' + req.url);
  console.log(req.body);
  res.json(501);
});

app.post(/\/.*/, function (req, res, next){
  console.log('POST: ' + req.url);
  console.log(req.body);
  res.json(501);
});

//console.log(util.inspect(app));
app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
