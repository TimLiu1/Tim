'use strict'
let cors = require('cors');
let logger = require('log4js').getLogger('tim');;
let User = require('../../models/User');
let Auth = require('../../lib/auth');
let co = require('co');
let Promise = require('bluebird');
let jwt = require("jsonwebtoken");
let async = require('async');
module.exports = function(app) {
    app.options('*', cors());
    app.post('/sign', cors(), function(req, res, next) {
        logger.info('注册用户: ' + JSON.stringify(req.body));
        let signCondition = {};
        let username = req.body.username;
        let password = req.body.password;
        signCondition.username = username;
        signCondition.password = password;
        async.waterfall([
            function(cb) {
                User.find({ username: username }, function(err, user) {
                    console.log('--->' + user)
                    if (err) {
                        return cb(err);
                    }
                    if (user) {
                        return cb(null, '该用户已注册');
                    }
                    cb(null, 1)
                })
            },
            function(result, cb) {
                let user = new User(signCondition);
                user.token = jwt.sign(user, "Tim");
                user.save(function(err, user1) {
                    if (err) {
                        return cb(err)
                    }
                    cb(null, user1);
                })
            }
        ], function(err, result) {
            if (err) {
                res.json({ code: '999', msg: '注册用户失败' })
            }
            console.log('过程完成')
            res.json({
                code: '000',
                user: result
            })
        })
    });

    app.post('/login', cors(), function(req, res) {
        logger.info('登录验证' + JSON.stringify(req.body));
        let username = req.body.username;
        let password = req.body.password;
        co(function*() {
            let user = yield User.findOne({ username: username, password: password });
            if (!user) { return Promise.reject("用户不存在或则密码错误") };
            let model = {
                code: '000',
                user: user
            }
            res.json(model);
        }).catch((err) => {
            logger.info("err" + err);
            res.json({ code: '999', msg: err })
        })

    })
}