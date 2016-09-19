'use strict'
let log4js = require('log4js');
let lg = function () {
    return {
        config: function (level) {
            let log4jsConfig = {
                    "levels": {
                        "[all]": level
                    },
                    "appenders": [
                          { type: 'console' }, //控制台输出
                        // {
                        //     "type": "dateFile",
                        //     "category": "tim",
                        //     "absolute": true,
                        //     "filename": process.env.HOME + "/logs/tim",
                        //     patten: "_yyyy-MM-dd" + (process.env.PORT ?("-" + process.env.PORT):"") + ".log",
                        //     "alwaysIncludePattern": true,
                        //     "layout":{
                        //         "type": "pattern",
                        //         "pattern": "%[% %p %c -%] %m%n"
                        //     }
                        // },
                        {
                        "type": "dateFile",
                        "absolute": true,
                        pattern: "_yyyy-MM-dd" + (process.env.PORT ? ("-" + process.env.PORT) : "") + ".log",
                        "alwaysIncludePattern": true,
                        "filename": process.env.HOME + "/logs/tim",
                        "layout": {
                            "type": "pattern",
                            "pattern": "%[%r %p %c -%] %m%n"
                        }
                    }
                    ],
                    "replaceConsole": true
            };
            log4js.configure(log4jsConfig);
        }
    }
};

module.exports = lg();