'use strict';

var app = require('./index');
var http = require('http');
var sio = require('./lib/SIO');


var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);
sio.init(server);
server.listen(process.env.PORT || 8888);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});

