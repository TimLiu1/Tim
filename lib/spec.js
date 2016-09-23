'use strict';

var db = require('./db');
var errorMessages = require('./middlewear/responseResult');
var log4jHelper = require('./log4jHelper');

module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
    });

    app.on('middleware:before:router', function configAfterRouter(eventargs) {
    });

    app.on('middleware:after:router', function configAfterRouter(eventargs) {
        app.use(errorMessages());
    });

    return {
        onconfig: function(config, next) {
            db.config(config.get('databaseConfig'));
            log4jHelper.config(config.get('loggerLevel'))
            next(null, config);
        }
    };

};

