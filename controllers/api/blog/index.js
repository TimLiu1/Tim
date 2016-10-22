'use strict'
/**
 * created By Tim;
 */
let Promise = require('bluebird');
let cors = require('cors');
let markdown = require('markdown').markdown;
let marked = require('marked');
let logger = require('log4js').getLogger('tim');
let hljs = require('highlight.js');
let blog = require('../../../models/blog/Blog');
let Auth = require('../../../lib/auth');
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
    app.post('/blog', function (req, res, next) {
        console.log('发布文章')
        let articleJson = req.body;
        let article = new blog(articleJson);
        article.save(function (err, result) {
            if (err) {
                next()
            }
            res.json(result);
        })
    })

    //查询指定blog
    app.get('/getBlog', function (req, res, next) {
        logger.info('查询指定blog');
        let _id = req.query._id;
        blog.findById(_id).exec().then((result) => {
            return result;
        }).then((result) => {
            if (req.query.flag && req.query.flag == '1') {
                result.content = marked(result.content);
            }
            console.log(result);
            let model = {
                code: '000',
                blog: result,
            }
            res.json(model)
        }).catch((err) => {
            res.json({ code: '999', msg: '查询数据库出错' + err });
        })
    })



    //查询blog列表
    app.post('/blogList', Auth.isAuthenticated(), function (req, res, next) {
        logger.info('查询指定blog列表')
        let conditionPage = {}
        let LIMIT = 5;
        let currentPage = 1;
        let condition = {}
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
            limit: LIMIT
        }
        console.log(req.body);
        if (req.body.currentPage) {
            conditionPage.page = req.body.currentPage;
        }
        blog.paginate(condition, conditionPage).then((blogs) => {
            blogs.docs.forEach((e) => {
                e.content = marked(e.content);
                e.content = (e.content).substring(0, 200);
            });
            var model = {
                blogs: blogs,
                total: blogs.total,
                pages: blogs.pages,
            }
            return model
            // res.json(model)
        }).then((model) => {
            blog.count().then((blog_count) => {
                model.blog_count = blog_count;
                res.json(model);
            })
        }).catch((err) => {
            logger.info('处理数据库列表出错'+err);
            res.json({ code: '999', msg: '处理数据库列表出错,稍后重试' })
        })
    })

    //删除blog
    app.get('/deleteBlog', function (req, res, next) {
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
    app.post('/updateBlog', function (req, res, next) {
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
    app.post('/exchangeTitle', function (req, res, next) {
        let content = "解析......";
        console.log('解析')
        if (req.body.content) {
            content = req.body.content
        }
        console.log('------->')


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

}


