'use strict';

var express = require('express');
var kraken = require('kraken-js');

var options, app;



app = module.exports = express();
options = require('./lib/spec')(app);
app.use(kraken(options));
app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
    console.log(app.settings.env)
});





