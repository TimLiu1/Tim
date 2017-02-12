'use strict'

var co = require('co');
var OSS = require('ali-oss');
var client = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: 'LTAIvWyXwy6LwMKi',
    accessKeySecret: 'QaucOO51i55dLUBolkJgs7p2qBn7oC'
});

var email = function () {
    var client;
    return {
        initOss: function (config) {
            let options = {
                region: config.region,
                accessKeyId: config.accessKeyId,
                accessKeySecret: config.accessKeySecret,
            }
            client = new OSS(options);
        },
        upload: function (emailMessage, callback) {
            emailMessage.from = fromMail;
            transporter.sendMail(emailMessage, function (err, response) {
                if (err) {
                    callback(err);
                } else {
                    console.log("Message sent: " + response.message);
                    callback(null, null);
                }
                transporter.close(); // 如果没用，关闭连接池
            })
        }
    }
}
