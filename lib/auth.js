'use strict'
/**
 * module will handle authentication task;
 */
let logger = require('log4js').getLogger('tim');
let User = require('../models/User');


/**
 * a help method to ensure a user from local DB 
 */

exports.localStrategy = function (username, pssword) {
    //登陆
    let condition = {};
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, {
                message: "用户名不存在"
            })
        }
        User.findOne({ username: username, password: password }, function (err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, {
                    message: "用户名不存在"
                })
            }
            return (null, user);

        })
    })

}
exports.isAuthenticated = function () {
    return function (req, res, next) {
        if (!req.headers.authorization) {
            res.json({ code: '999', msg: '请登录' });
            return;
        }
        console.log(req.headers.authorization)
        let arr = (req.headers.authorization).split(" ");
        if (arr[0] != 'Tim') {
            res.json({ code: '400', 'msg': '非法登录，请重新登录' })
        }
        User.findOne({ token: arr[1] }, function (err, user) {
            if (err) {
                logger.info('查询数据库出错');
                res.json({ code: '999', msg: '非法登录' });
                return;
            }
            if (!user) {
                res.json({ code: '400', msg: '非法登录' });
                return;
            }
            req.user = user;
            next();
        })
    }

}




