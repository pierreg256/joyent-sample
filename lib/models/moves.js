var Db = require('mongodb').Db
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID,
    util = require('util');
    
var DATABASE_NAME = "social-demo-db";
var COLLECTION_NAME = "moves"; 

MoveProvider = function(host, port) {
  this.db= new Db(DATABASE_NAME, new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


MoveProvider.prototype.getCollection= function(callback) {
  this.db.collection(COLLECTION_NAME, function(error, user_collection) {
    if( error ) callback(error);
    else callback(null, user_collection);
  });
};

MoveProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


MoveProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        user_collection.findOne({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

MoveProvider.prototype.findByField = function(fieldName, fieldValue, callback) {
  console.log('fieldName:'+fieldName);
  console.log('fieldValue:'+fieldValue);
  this.getCollection( function (err, user_collection) {
    if (err) {
      callback(err);
    } else {
      var searchCrit = {};
      searchCrit[fieldName]=fieldValue;
      console.log(util.inspect(searchCrit));
      user_collection.findOne(searchCrit, function (err, user) {
        if (err) {
          callback (err);
        } else {
          callback (null, user);
        }
      });
    }
  });
};

MoveProvider.prototype.findAllByField = function(fieldName, fieldValue, callback) {
  console.log('fieldName:'+fieldName);
  console.log('fieldValue:'+fieldValue);
  this.getCollection( function (err, user_collection) {
    if (err) {
      callback(err);
    } else {
      var searchCrit = {};
      searchCrit[fieldName]=fieldValue;
      console.log(util.inspect(searchCrit));
      user_collection.find(searchCrit).toArray( function (err, resultat) {
        if (err) {
          callback (err);
        } else {
          callback (null, resultat);
        }
      });
    }
  });
};

MoveProvider.prototype.save = function(users, callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
        if( typeof(users.length)=="undefined")
          users = [users];

        for( var i =0;i< users.length;i++ ) {
          user = users[i];
          if ('undefined'==user.created_at) {
            user.created_at = new Date();
          }
          user.last_modified = new Date();
        }

        user_collection.insert(users, function(err) {
          callback(err, users);
        });
      }
    });
};

exports.MoveProvider = MoveProvider;