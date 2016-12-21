'use strict';
var videojs = require('video.js');
var Hls = require('@hola.org/hls.js');
var hlsjs_source_handler = require('@hola.org/videojs5-hlsjs-source-handler');

module.exports = function(){
    hlsjs_source_handler.attach(window, videojs, Hls);
};
