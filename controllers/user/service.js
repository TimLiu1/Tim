'use strict'

const crypto = require('crypto');
let email = require('../../lib/email');
let Promise = require('bluebird');
let logger = require('log4js').getLogger('tim');
let Message = require('../../lib/shortMessage');
//发送邮件

exports.sendEmail = function (obj, cb) {
    let mailOptions = {
        to: obj.to,
        subject: obj.subject,
        html: obj.html
    }
    email.send(mailOptions, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result);
        }
    });
}


exports.shortMessage = Promise.promisify((obj, cb) => {
    logger.info("发送短信")
    let message = {
        sms_free_sign_name: obj.name,
        sms_param: obj.sms,
        rec_num: obj.num,
        sms_template_code: obj.code
    }
    Message.send(message, function (err, result) {
        if (err) {
            logger.info("err: " + err)
            cb(err)
        } else {
            cb(null, result);
        }
    })
})

