'use strict'
/**
 * module will handle authentication task;
 */
let logger = require('log4js');
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
exports.isAuthenticated = function(){
    return function(req,res,next){
       if(!req.headers.authorization){
           res.json({code:'999',msg:'请登录'});
           return; 
       }
       next();
    }

}




