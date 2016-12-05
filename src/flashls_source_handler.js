'use strict';
var videojs = require('video.js');
var mime = require('./mime.js');

module.exports = function(){
    videojs.getComponent('Flash').registerSourceHandler({
        canHandleSource: function(source){
            if (mime.is_hls_type(source.type))
                return 'probably';
            else if (mime.is_hls_link(source.src))
                return 'maybe';
            return '';
        },
        handleSource: function(source, tech){ tech.setSrc(source.src); }
    }, 0);
};
