var http = require('http');
const {getListenArgs} = require('../lib/systemd');

const server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
});

var port = 1337;
const listenArgs = getListenArgs() || [port];
server.listen(...listenArgs);
