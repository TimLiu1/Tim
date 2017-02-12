'use strict'

const nodemailer = require('nodemailer');


var fromMail;
var email = function () {
    var transporter;
    return {
        initEmail: function (config) {
            let options = {
                service: config.service,
                host: config.host,
                secureConnection: true,
                port: config.port,
                auth: {
                    user: config.user,
                    pass: config.password
                }
            }
            fromMail = config.fromMail;
            transporter = nodemailer.createTransport(options)
        },
        send: function (emailMessage, callback) {
            emailMessage.from = fromMail;
            transporter.sendMail(emailMessage, function (err, response) {
                if (err) {
                    callback(err);
                } else {
                    console.log("Message sent: " + response.message);
                    callback(null,null);
                }
                transporter.close(); // 如果没用，关闭连接池
            })
        }
    }
}






module.exports = email();

