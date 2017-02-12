'use strict'
const crypto = require('crypto');
//获取头像
exports.headImage = function (obj) {
    let md5 = crypto.createHash('md5');
    let email_md5 = md5.update(obj.email.toLowerCase()).digest('hex');
    let headImage = "http://www.gravatar.com/avatar/" + email_md5 + "?s=48";
    console.log(headImage);
    return headImage
}
