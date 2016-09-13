'use strict'
let mongoose = require('mongoose');
let updatedTimestamp = require('mongoose-updated_at');
let mongoosePaginate = require('mongoose-paginate');

let blogShema = new mongoose.Schema({
    // 标题
    title:String,
    //正文
    content:String,
    //标签
    label:[],
    //创建日期
    createdAt:{
        type:Date,
        default:Date.now
    }

},{collection:'blog'});

blogShema.plugin(updatedTimestamp);
blogShema.plugin(mongoosePaginate);

module.exports = mongoose.model('blogShema',blogShema);