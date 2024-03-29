var Users = require('../models/users').UserProvider;

var users = new Users('localhost', 27017);

exports.get = function (req, res, next) {
  if (req.user.email == req.params.userid) {
    res.json({users:req.user}, 200);
  } else {
    res.json({err:404, msg:"user not found"}, 404);
  }
  /*
  users.findByField ('email', req.params.userid, function(err, user){
    if (err) {
      res.json({err:404, msg:"user not found", detail:err},404);
    } else {
      if (user) {
        res.json(user, 200);
      } else {
        res.json({err:404, msg:"user not found"}, 404);
      }
    }
  });
  */
}

exports.post = function(req, res, next) {
  var new_user = req.body;
  
  users.findByField('email', new_user.email, function (err, user){
    if (err) {
      res.json({msg: 'internal error'}, 500);
    } else {
      if (user) {
        res.json({msg: 'duplicate email'}, 403)
      } else {
        users.save(new_user, function (err, result){
          if (err) {
            res.json({msg: 'internal error occured during save', detail:err}, 500);
          } else {
            //res.header('location', req.url);
            res.json({users:result}, 201);
          }
        });
      }
    }
  });
};

exports.put = function(req, res, next) {
  var oldu = req.user;
  var newu = req.body;
  
  oldu.firstname = newu.firstname;
  oldu.lastname = newu.lastname;
  oldu.password = newu.password;
  console.log(oldu);
  
  users.save(oldu, function (err, users){
    if (err) {
      console.log(err)
      res.json(err, 500);
    } else {
      res.send(204);
    }
  });
  
  //res.json(501);
}

exports.identity = function(req, res, next) {
  console.log(req.headers);
  res.json(req.user,200);
}

exports.authenticate = function (req, res, next) {
  console.log('authenticating url: '+req.url + ', headers('+JSON.stringify(req.headers)+')');
  var requestUsername = "";
  var requestPassword = "";
  if (!req.headers['authorization'])
  {
      res.json({msg:"Basic Authentication Required"},401);
  }
  else
  {
      var auth = new Buffer(req.headers['authorization'].split(' ')[1] || '', 'base64').toString('utf8');
      requestUsername = auth.split(':')[0];
      requestPassword = auth.split(':')[1];

      users.findByField ('email', requestUsername, function(err, user){
        if (err) {
          res.send(401);
        } else {
          if (user) {
            if (user.password == requestPassword) {
              req.user = user;
              next();
            } else {
              res.send(403);
            }
          } else {
            res.send(401);
          }
        }
      });

      //next();
      //res.json({msg:"decoded", 200});
  }

  
}