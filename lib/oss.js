'use strict'

var co = require('co');
var OSS = require('ali-oss');
var client = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: 'LTAIvWyXwy6LwMKi',
    accessKeySecret: 'QaucOO51i55dLUBolkJgs7p2qBn7oC'
});

var email = function () {
    let client;
    return {
        initOss: function (config) {
            let options = {
                region: config.region,
                accessKeyId: config.accessKeyId,
                accessKeySecret: config.accessKeySecret,
            }
            client = new OSS(options);
        },
        upload: function (obj) {
            return co(function* () {
                client.useBucket('zukuan');
                console.log(obj);
                var result = yield client.put(obj.remotePath, obj.path);

                return Promise.resolve(result);
            }).catch((err) => {
                if (err) { console.log('err: ' + err); }
                return Promise.reject(err);
            })
        }
    }
}

module.exports = email();
