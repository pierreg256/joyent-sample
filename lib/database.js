var Db = require('mongodb').Db,
  Connection = require('mongodb').Connection,
  Server = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var LINE_SIZE = 120;

console.log("Connecting to " + host + ":" + port);
var db = new Db('cap-tests', new Server(host, port, {}), {native_parser:false });
db.open(function(err, db) {
  db.dropDatabase(function(err, result) {
    console.log('database dropped');
    
    console.log("===================================================================================");        
    console.log(">> Adding users");        
    console.log("===================================================================================");                        
    db.collection('users', function(err, userCollection) {
      var users = {};
      userCollection.insert([{'login':'jdoe', 'name':'John Doe', 'email':'john@doe.com'}, 
                      {'login':'lsmith', 'name':'Lucy Smith', 'email':'lucy@smith.com'}], function(err, docs) {
                        console.log('users added');
                    });
                  });
  });
});

