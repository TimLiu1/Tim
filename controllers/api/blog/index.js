'use strict'

/**
 * created By Tim;
 * 
 */

let Promise = require('bluebird');
let cors = require('cors');
let async = require('async')
let markdown = require('markdown').markdown;
let marked = require('marked');
let moment = require('moment');
let logger = require('log4js').getLogger('tim');
let hljs = require('highlight.js');
let blog = require('../../../models/blog/Blog');
let Auth = require('../../../lib/auth');
let email = require('../../../lib/email');
let Message = require('../../../lib/shortMessage');
let SIO = require('../../../lib/SIO');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: false,
    smartypants: false,
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
});
var renderer = new marked.Renderer();
renderer.table = function (header, body) {
    return '<table class="table table-striped">' + header + body + '</table>'
}

module.exports = function (app) {
    app.options('*', cors())
    //发布博文
    app.post('/blog', Auth.isAuthenticated(), function (req, res, next) {
        logger.info('发布文章', req.body)
        logger.info('发布文章user' + JSON.stringify(req.user));
        let articleJson = req.body;
        articleJson.postMan = req.user.username;

        let article = new blog(articleJson);
        article.save(function (err, result) {
            if (err) {
                console.log("err",err)
                return next()
            }
            res.json(result);
        })
    })

    //查询指定blog
    app.get('/getBlog', cors(), function (req, res, next) {
        logger.info('查询指定blog');
        let _id = req.query._id;

        blog.findById(_id).exec().then((result) => {
            return result;
        }).then((result) => {
            if (req.query.flag && req.query.flag == '1') {
                result.content = marked(result.content);
            }
            let model = {
                code: '000',
                blog: result,
            }
            res.json(model)
        }).catch((err) => {
            res.json({ code: '999', msg: '查询数据库出错' + err });
        })
    })
    //Auth.isAuthenticated(),

    //查询blog列表
    app.post('/blogList', cors(), function (req, res, next) {
        logger.info('查询blog列表' + JSON.stringify(req.body));
        let conditionPage = {}
        let LIMIT = 5;
        let currentPage = 1;
        let condition = {};

        // 如果通过月份查询数据
        let year = req.body.year;
        let month = req.body.month;
        if (year) {
            let start = moment(year + '-' + month + '-01').startOf('month').toDate();
            let end = moment(year + '-' + month + '-01').endOf('month').toDate();
            condition = { createdAt: { "$gte": start, "$lte": end } }
        }

        let conditionGroup = { $group: { _id: { year: { "$year": "$createdAt" }, month: { "$month": "$createdAt" } }, sum: { "$sum": 1 } } }
        let conditionJson = { $match: {} };
        let title = new RegExp(req.body.title)
        let label = req.body.label
        if (title) {
            condition.title = title;
        }
        if (label) {
            condition.labels = label;
        }
        conditionPage = {
            page: currentPage,
            limit: LIMIT,
            sort: "-createdAt"
        }
        logger.info(condition);
        if (req.body.currentPage) {
            conditionPage.page = req.body.currentPage;
        }

        async.parallel([
            function (cb) {
                blog.count().then((blog_count) => {
                    cb(null, blog_count)
                }).catch((err) => {
                    return cb(err)
                })
            },
            function (cb) {
                blog.paginate(condition, conditionPage, (err, blogs) => {
                    if (err) {
                        return cb(err)
                    }
                    cb(null, blogs)
                })

            },
            function (cb) {
                blog.aggregate([conditionJson, conditionGroup], (err, blogList) => {

                    if (err) {
                        logger.info("woshi" + err)
                        return cb(err)
                    }
                    cb(null, blogList)
                })


            }
        ], function (err, results) {
            if (err) {
                logger.info('处理数据库列表出错' + err);
                res.json({ code: '999', msg: '处理数据库列表出错,稍后重试' })
            }
            results[2].forEach((e) => {
                e.time = e._id.year + "年" + e._id.month + "月"
            })

            results[1].docs.forEach((e) => {
                e.content = marked(e.content);
                e.content = (e.content).substring(0, 200);
            });
            var model = {
                blogs: results[1],
                blog_count: results[0],
                blogList: results[2],
            }
            res.json(model);

        })


        // blog.paginate(condition, conditionPage).then((blogs) => {
        //     blogs.docs.forEach((e) => {
        //         e.content = marked(e.content);
        //         e.content = (e.content).substring(0, 200);
        //     });
        //     var model = {
        //         blogs: blogs,
        //         total: blogs.total,
        //         pages: blogs.pages,
        //     }
        //     return model
        //     // res.json(model)
        // }).then((model) => {
        //     blog.count().then((blog_count) => {
        //         model.blog_count = blog_count;
        //         res.json(model);
        //     })
        // }).catch((err) => {
        //     logger.info('处理数据库列表出错' + err);
        //     res.json({ code: '999', msg: '处理数据库列表出错,稍后重试' })
        // })
    })

    //删除blog
    app.get('/deleteBlog', cors(), function (req, res, next) {
        var _id = req.query._id;
        logger.info('删除博客' + _id);
        blog.remove({ _id: _id }, function (err) {
            if (err) {
                logger.info("查询数据库出错" + err);
                res.json({ code: '999', msg: '查询数据库失败' + err })
            }
            var model = {
                code: '000',
                msg: '删除成功'
            }
            res.json(model)
        })
    })


    //更新blog
    app.post('/updateBlog', cors(), function (req, res, next) {
        var contentJson = req.body;
        var _id = req.body._id;

        logger.info('更新博客' + _id);
        blog.update({ _id: _id }, { $set: contentJson }, function (err) {
            if (err) {
                logger.info("更新数据库出错" + err);
                res.json({ code: '999', msg: '更新数据库失败' + err })
            }
            var model = {
                code: '000',
                msg: '更新成功'
            }
            res.json(model)
        })
    })

    //markdown语法转换器
    app.post('/exchangeTitle', cors(), function (req, res, next) {
        let content = "解析......";
        logger.info('解析')
        if (req.body.content) {
            content = req.body.content
        }
        logger.info('------->')


        //  SIO.io.on('contentC', function (data) {
        //      console.log(data);
        //      content = marked(content);
        // });
        // console.log('------')
        // SIO.io.emit('contentS',content);
        //console.log('/bluewhale');
        //此处可获取客户端的cookie，在socket.handshake中，用于定位连接的客户端


        // content = marked(content);
        let model = {
            code: '000',
            content: content
        };
        res.json(model);

    })

    // 通过月份查找blog
    app.get('/searchByMonth', cors(), function (req, res) {
        let year = req.query.year;
        let month = req.query.month;
        let start = moment(year + '-' + month + '-01').startOf('month').toDate();;
        let end = moment(year + '-' + month + '-01').endOf('month').toDate();;
        let condition = {

        }
    })

    app.get('/message', function (req, res) {
        logger.info("发送短信")
        let message = {
            sms_free_sign_name: 'Tim的博客',
            sms_param: { "code": "123456", "name": "刘祖宽" },
            rec_num: '18818216454',
            sms_template_code: 'SMS_46340179'
        }
        Message.send(message, function (err, result) {
            console.log(result)
        })
    })

}


