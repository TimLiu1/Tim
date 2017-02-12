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



