var moment = require('moment');

module.exports = function(req,res,next){
    return function(req,res,next){
       res.render('errors/404')
    }
}