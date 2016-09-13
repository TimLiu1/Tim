/**
 * A custom library to establish a database conection
 * 
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


var db = function () {
    return {

        /**
         * Open a connection to the database
         */

        config: function (conf) {
            var url = '';
            if (global.env == 'production') {
                url = conf.host
            } else {
                url = 'mongodb://' + conf.host + '/' + conf.database;
            }
            var opts = conf.options;
            // if (global.env === 'production') {
            //     opt.db = {
            //         save: {
            //             j: 1,
            //             w: 2
            //         }
            //     };
            // }
            mongoose.connect(url, opts);

            var db = mongoose.connection;

            db.on('error', console.error.bind(console,'connection error'));
            db.once('open', function callback(){
                console.log('db connection open')
            })
        }
    }
}

module.exports = db();
