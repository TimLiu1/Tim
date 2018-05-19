'use strict';

let db = require('./db');
let errorMessages = require('./middleware/responseResult');
let log4jHelper = require('./log4jHelper');
let email = require('./email');
let shortMessage = require('./shortMessage');
// const cacheHelper = require('../lib/cacheHelper');

let OSS = require('./oss');
let passport = require("passport"),
    GitHubStrategy = require('passport-github').Strategy;



module.exports = function spec(app) {
    app.on('middleware:after:session', function configPassport(eventargs) {
        app.use(passport.initialize());
        passport.use(new GitHubStrategy({
            clientID: 'f737f099dc29f35179ca',
            clientSecret: '97964133a556b5521539167981c5a93dffbb9a33',
            callbackURL: 'http://localhost:8888/user/login/github/callback'
        }, function (accessToken, refreshToken, profile, done) {
            done(null, profile);
        }))
    });

    app.on('middleware:before:router', function configAfterRouter(eventargs) {
    });

    app.on('middleware:after:router', function configAfterRouter(eventargs) {
        app.use(errorMessages());
    });

    return {
        onconfig: function (config, next) {
            db.config(config.get('databaseConfig'));
            log4jHelper.config(config.get('loggerLevel'))
            email.initEmail(config.get('emailConfig').tim);
            shortMessage.initMessage(config.get('message').tim);
            // cacheHelper.config(config.get('cacheConfig'));
            OSS.initOss(config.get('oss').tim)
            next(null, config);
        }
    };

};

