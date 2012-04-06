var util = require('util')
, UserProvider = require('../lib/models/users').UserProvider
, MoveProvider = require('../lib/models/moves').MoveProvider;

var userProvider = new UserProvider('localhost', 27017);
var tripProvider = new MoveProvider('localhost', 27017);

/*
 * GET home page.
 */

exports.index = function(req, res){
  var usr = [];
  userProvider.findAll(function(err, users){
    if (err) {
      usr = [];
      res.render('index', { title: 'essaiLoc : Bienvenue', users: usr });
    } else {
      usr = users;
      res.render('index', { title: 'essaiLoc : Bienvenue', users: usr });
    }
  });
};

exports.details = function (req, res, next) {
  userProvider.findByField('email', req.param('user_id'), function(err, users){
    if (err) {
      res.send(404);
    } else {
      usr = users;
      tripProvider.findAllByField('user_id', req.param('user_id'), function(err, trips){
        if (err) {
          res.send(util.inspect(err), 500);
        } else {
          res.render('detail', { title: 'essaiLoc : Details pour '+req.param('user_id'), details: {user: usr, "trips":trips} });
        }
      });
    }
  });
  //res.render('details', { title: 'essaiLoc : Details Utilisateur', user:usr });
}