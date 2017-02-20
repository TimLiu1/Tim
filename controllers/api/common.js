'use strict'
let cors = require('cors');
let logger = require('log4js').getLogger('tim');
let OSS = require('../../lib/oss');
let co = require('co');

module.exports = function (app) {
    app.options('*', cors());

    //照片上传
    app.post('/image', function (req, res) {
        co(function* () {
            let fileName = 'tim';
            logger.info("照片上传接口启动" + JSON.stringify(req.files));
            let file = req.files.file;
            let result = yield OSS.upload({
                remotePath: fileName + "/" + file.name,
                path: file.path
            })
            let data = {
                name: result.name,
                url: result.url
            }
            logger.info(data);
            res.json(data)

        }).catch((err) => {
            if (err) { logger.info('err: ' + err); }
        })



    })

}