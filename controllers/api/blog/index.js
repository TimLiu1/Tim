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

    //查询指定blog
    app.get('/getBlog',function(req,res,next){
        logger.info('查询指定blog');
        let _id = req.query._id;
        blog.findById(_id).exec().then((result) => {
            return result;
        }).then((result) => {
            let model = {
                code:'000',
                blog:result,
            }
            res.json(model)
        }).catch((err) => {
            res.json({code:'999',msg:'查询数据库出错'+err});
        })
    })



    //查询blog列表
    app.get('/blogList',function(req,res,next){
        logger.info('---查询博客列表----');
        blog.find({},function(err,blogs){
            if(err){
               logger.info("查询数据库出错"+err);
                res.json({code:'999',msg:'查询数据库失败'+err})
            }
            blogs.forEach((e) => {
                e.content = markdown.toHTML(e.content);
            });
            var model = {
                blogs:blogs
            }

            console.log(model);
            res.json(model)
        })
    })

        //删除blog
      app.get('/deleteBlog',function(req,res,next){
          var _id = req.query._id;
        logger.info('删除博客'+_id);
        blog.remove({_id:_id},function(err){
            if(err){
               logger.info("查询数据库出错"+err);
                res.json({code:'999',msg:'查询数据库失败'+err})
            }
           var model = {
               code:'000',
               msg:'删除成功' 
           } 
            res.json(model)
        })
    })



     app.post('/updateBlog',function(req,res,next){
         var contentJson = {};
         let title = req.body.title;
         let content = req.body.content;
         if(title){
             contentJson.title = title;
         }
         if(content){
             contentJson.content = content;
         }

          var _id = req.body._id;

        logger.info('更新博客'+_id);
        blog.update({_id:_id},{$set:contentJson},function(err){
            if(err){
               logger.info("更新数据库出错"+err);
                res.json({code:'999',msg:'更新数据库失败'+err})
            }
           var model = {
               code:'000',
               msg:'更新成功' 
           } 
            res.json(model)
        })
    })



}
