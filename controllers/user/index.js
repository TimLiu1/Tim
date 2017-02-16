'use strict'
let cors = require('cors');
let logger = require('log4js').getLogger('tim');;
let User = require('../../models/User');
let Auth = require('../../lib/auth');
let email = require('../../lib/email');
let service = require('./service');
let way = require('./way');

var Promise = require('bluebird');
let co = require('co');
let jwt = require("jsonwebtoken");
let async = require('async');
let passport = require('passport');

Promise.promisifyAll(service);


module.exports = function (app) {
    app.options('*', cors());
    app.post('/sign', cors(), function (req, res, next) {
        logger.info('注册用户: ' + JSON.stringify(req.body));
        let body = req.body;
        console.log(body.flag);
        if (body.flag == 2) {
            console.log("手机注册")
            signMobile(body, res);
            return;
        } else {
            co(function* () {
                let signCondition = {};
                let username = req.body.username;
                let password = req.body.password;
                signCondition.username = body.username;
                signCondition.password = body.password;
                signCondition.email = body.email;
                signCondition.headImage = way.headImage(body);
                let userOne = yield User.findOne({ username: username });
                if (userOne) { return Promise.reject("该用户已被注册") };
                userOne = yield User.findOne({ email: body.email });
                if (userOne) { return Promise.reject("该邮箱已被注册") };

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
        }

    });

    function signMobile(body, res) {
        return co(function* () {
            let signCondition = {};
            let password = body.password;
            signCondition.mobile = body.mobile;
            signCondition.password = body.password;
            signCondition.headImage = 'http://www.gravatar.com/avatar/03bb2effa687bada0f40f26bae3dfc11?s=48';
            let userOne = yield User.findOne({ mobile: body.mobile });
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
    }

    app.post('/login', cors(), function (req, res) {
        logger.info('登录验证' + JSON.stringify(req.body));
        let username = req.body.username;
        let password = req.body.password;
        co(function* () {
            let user = yield User.findOne({ $or: [{ username: username }, { email: username },{mobile:username}], password: password });
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

    app.get('/login/github', passport.authenticate('github', { session: false }));


    app.get('/login/github/callback', passport.authenticate('github', {
        session: false,
        failureRedirect: '/login'
        // successFlash:"登录成功?"
    }), function (req, res) {
        console.log("-----棒棒哒")
        console.log(req.user)
    });

    /**
     * 找回密码
     */
    app.post('/findPassword', function (req, res) {
        logger.info("找回密码启动" + JSON.stringify(req.body))
        co(function* () {
            let email = req.body.email
            let userOne = yield User.findOne({ email: email });
            if (!userOne) { Promise.reject("email不存在") }
            let obj = {
                to: email,
                subject: "密码找回",
                html: "<h6>你的密码是</h6><h7>" + userOne.password + "</h7>,请妥善保管，以防再次丢失。"
            }
            let result = yield service.sendEmailAsync(obj);
            res.json({ code: '000', msg: "密码已发送，请登陆邮箱查看" })
        }).catch((err) => {
            logger.info("err" + err.stack);
            res.json({ code: '999', msg: "err" + err })
        })
    })


    /**
     * 获取验证码
     */
    app.post('/sendCode', function (req, res) {
        logger.info("获取验证码" + JSON.stringify(req.body))
        let body = req.body;
        let code = Math.random().toString().slice(-6);
        co(function* () {
            let message = {
                name: 'Tim的博客',
                sms: { "code": code, "name": "客户" },
                num: body.mobile,
                code: 'SMS_46340179'
            }
            let result = yield service.shortMessage(message);
            res.json({ code: '000', sendCode: code })
        }).catch((err) => {
            logger.info("err" + err.stack);
            res.json({ code: '999', msg: "err" + err })
        })
    })



    app.get('/message', function (req, res) {
        logger.info("发送短信")
        let message = {
            sms_free_sign_name: 'Tim的博客',
            sms_param: { "code": "123456", "name": "刘祖宽" },
            rec_num: '18818216454',
            sms_template_code: 'SMS_46340179'
        }
        Message.send(message, function (err, result) {
            console.log(result)
        })
    })



}