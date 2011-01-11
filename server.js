
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'content-type': 'text/plain'});
  res.end('My Own Private Hello World\n');
}).listen(80);

console.log("service demarre");

