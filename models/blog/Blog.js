'use strict'
let mongoose = require('mongoose');
let updatedTimestamp = require('mongoose-updated_at');
let mongoosePaginate = require('mongoose-paginate');
let autoIncrement = require('mongoose-auto-increment');

let connection = mongoose.connection;
autoIncrement.initialize(connection);

let blogShema = new mongoose.Schema({
    // 作者
    author: {
        type: String,
        default: 'Tim'
    },
    // 标题
    title: String,
    //正文
    content: String,
    //标签
    labels: [],
    //创建日期
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'blog' });

blogShema.plugin(updatedTimestamp);
blogShema.plugin(autoIncrement.plugin,{
    model:'blog',
    field: 'order',
    startAt:8
});
blogShema.plugin(mongoosePaginate);

module.exports = mongoose.model('blogShema', blogShema);