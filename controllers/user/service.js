'use strict'

const crypto = require('crypto');
let email = require('../../lib/email');

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


exports.shortMessage = (obj,cb) => {
    logger.info("发送短信")
    console.log(Math.random().toString().slice(-7));
    let message = {
        sms_free_sign_name: sms_free_sign_name,
        sms_param: sms_param,
        rec_num: rec_num,
        sms_template_code: sms_template_code
    }
    Message.send(message, function (err, result) {
        console.log(result)
    })
}

