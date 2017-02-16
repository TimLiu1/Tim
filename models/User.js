'use strict'
let mongoose = require('mongoose');
let updatedTimestamp = require('mongoose-updated_at');
let mongoosePaginate = require('mongoose-paginate');

let userSchema = new mongoose.Schema({
    // 用户名
    username: String,
    //邮箱
    email: String,
    //手机
    mobile: String,
    // 头像
    headImage: String,
    //密码
    password: String,
    //token
    token: String,
    //创建日期
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { collection: 'user' });

userSchema.plugin(updatedTimestamp);
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);