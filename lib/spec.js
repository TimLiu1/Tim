'use strict';

var db = require('./db');
var errorMessages = require('./middlewear/responseResult')

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
            next(null, config);
        }
    };

};
