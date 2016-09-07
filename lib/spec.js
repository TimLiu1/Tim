'use strict';

module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
    });

    app.on('middleware:before:router', function configAfterRouter(eventargs) {
    });

    app.on('middleware:after:router', function configAfterRouter(eventargs) {
        //app.use(errorMessages());
    });

    return {
        onconfig: function(config, next) {
           
            next(null, config);
        }
    };

};
