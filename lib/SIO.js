'use strict'
let marked = require('marked');
let logger = require('log4js').getLogger('tim');
let hljs = require('highlight.js');


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
    return '<table class="table table-striped">'+header+body+'</table>'
}

var SIO = {
    init: function (server) {
        let content = '12'
        this.io = require('socket.io')(server);
        this.io.on('connection', function (socket) {
            socket.on('contentC', function (data) {
                console.log(data);
                content = marked(data);
                socket.emit('contentS', content);
            });
            
            // socket.emit('contentS',content);                             
            console.log('------')
            //console.log('/bluewhale');
            //此处可获取客户端的cookie，在socket.handshake中，用于定位连接的客户端
        });
    },

};

module.exports = SIO;