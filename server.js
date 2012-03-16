var restify = require('restify');

function respond(req, res, next) {
  console.log('request: '+req.url);
  res.json({params:req.params});
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);


server.get('/api/users/:id', function (req, res, next){
  if (req.params.id == 127) {
    res.json(200,{
      "id": 127,
      "firstname": "pierre",
      "surname": "gilot",
      "email":"email@domain.com"
    });
  } else {
    res.json(404,{
      error: 404,
      message: "user not found"
    });
  }
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
