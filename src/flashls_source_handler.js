'use strict';
var videojs = require('video.js');
var hlsTypeRE = /^application\/x-mpegURL$/i;
var hlsExtRE = /\.m3u8/i;
module.exports = function(){
    videojs.getComponent('Flash').registerSourceHandler({
        canHandleSource: function(source){
            if (hlsTypeRE.test(source.type))
                return 'probably';
            else if (hlsExtRE.test(source.src))
                return 'maybe';
            return '';
        },
        handleSource: function(source, tech){ tech.setSrc(source.src); }
    }, 0);
};
