'use strict'

const App = require('alidayu-node');

var app;
var shortMessage = function () {
    return {
        initMessage: function (config) {
            app = new App(config.appKey, config.secret);
        },
        send: function (message, callback) {
            app.smsSend(message, function (response) {
                if (response.error_response) {
                    console.log("err: " + JSON.stringify(response.error_response))
                    callback(response.error_response.sub_msg);
                } else {
                    console.log("Message sent success");
                    callback(null, null);
                }
            })
        }
    }
}






module.exports = shortMessage();

