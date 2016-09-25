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

module.exports = function (app) {
    app.options('*', cors())
    //发布博文
    app.post('/blog', function (req, res, next) {
        console.log('发布文章')
        let articleJson = {};
        let title = req.body.title;
        let content = req.body.content;
        let tag = req.body.tag;
        if (title) {
            articleJson.title = title
        }
        if (content) {
            articleJson.content = content
        }
        if (tag) {
            articleJson.tag = tag
        }

        let article = new blog(articleJson);
        article.save(function (err, result) {
            if (err) {
                next()
            }
            // console.log(result);
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
        console.log(model);
            res.json(model)
        }).catch((err) => {
            res.json({ code: '999', msg: '查询数据库出错' + err });
        })
    })



    //查询blog列表
    app.post('/blogList', function (req, res, next) {
        logger.info('查询指定blog列表')
        let conditionPage = {}
        let LIMIT = 10;
        let currentPage = 1;
        conditionPage = {
            page: currentPage,
            limit: LIMIT
        }
        console.log(req.body);
        if (req.body.currentPage) {
            conditionPage.page = req.body.currentPage;
        }
        blog.paginate({}, conditionPage, function (err, blogs) {
            if (err) {
                logger.info("查询数据库出错" + err);
                res.json({ code: '999', msg: '查询数据库失败' + err })
            }
            // console.log(blogs);
            blogs.docs.forEach((e) => {
                e.content = (e.content).substring(0, 100);
            });

            let blogC = [];
            let detail = [];
            blogs.docs.forEach((e, index) => {
                detail.push(e);
                if (detail.length == 2) {
                    blogC.push(detail);
                    detail = [];
                }
            });
            detail = [];
            if (blogs.docs.length % 2 != 0) {
                console.log(blogs.docs[1]);
                detail.push(blogs.docs[blogs.docs.length - 1]);
                blogC.push(detail);
            }
            var model = {
                blogs: blogC,
                total: blogs.total,
                pages: blogs.pages,
            }
            res.json(model)
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
        var contentJson = {};
        let title = req.body.title;
        let content = req.body.content;
        if (title) {
            contentJson.title = title;
        }
        if (content) {
            contentJson.content = content;
        }

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
        if (req.body.content) {
            content = req.body.content
        }
        content = marked(content);
        let model = {
            code: '000',
            content: content
        };
        res.json(model);

    })

}
