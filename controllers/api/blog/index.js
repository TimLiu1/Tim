'use strict'

let Promise = require('bluebird');
let markdown = require('markdown').markdown;
let logger = require('log4js').getLogger('tim');
let blog = require('../../../models/blog/Blog');



module.exports = function (app) {
    //发布博文
    app.post('/blog', function (req, res,next) {
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
        article.save(function(err,result){
            if(err){
                next()
            }
            console.log(result);
            res.json(result);
            
        })
    })

    app.get('/blogList',function(req,res,next){
        console.log(req.query)
        logger.info('---查询博客列表----');
        blog.find({},function(err,blogs){
            if(err){
                console.log("查询数据库出错"+err);
                res.json({code:'999',msg:'查询数据库失败'+err})
            }
            blogs.forEach((e) => {
                e.content = markdown.toHTML(e.content);
            });
            var model = {
                blogs:blogs
            }
            res.json(model)
        })
    })

}
