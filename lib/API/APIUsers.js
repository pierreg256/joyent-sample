var Users = require('../models/users').UserProvider;

var users = new Users('localhost', 27017);

exports.get = function (req, res, next) {
  console.log(users);
  
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
}