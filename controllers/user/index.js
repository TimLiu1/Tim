'use strict'
let cors = require('cors');
let logger = require('log4js').getLogger('tim');;
let User = require('../../models/User');
let Auth = require('../../lib/auth');
let co = require('co');
let Promise = require('bluebird');
let jwt = require("jsonwebtoken");
let async = require('async');
module.exports = function (app) {
    app.options('*', cors());
    app.post('/sign', cors(), function (req, res, next) {
        co(function* () {
            logger.info('注册用户: ' + JSON.stringify(req.body));
            let signCondition = {};
            let username = req.body.username;
            let password = req.body.password;
            signCondition.username = username;
            signCondition.password = password;
            let userOne = yield User.findOne({ username: username });
            if (userOne) { return Promise.reject("该用户已被注册") };

            let user = new User(signCondition);
            user.token = jwt.sign(user, "Tim");
            yield user.save();
              res.json({
                code: '000',
                user: "success"
            })

        }).catch((err) => {
            logger.info('err: ' + err)
            res.json({ code: '999', msg: "err:" + err })
        })
});

app.post('/login', cors(), function (req, res) {
    logger.info('登录验证' + JSON.stringify(req.body));
    let username = req.body.username;
    let password = req.body.password;
    co(function* () {
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