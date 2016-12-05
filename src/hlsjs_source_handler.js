'use strict';
var videojs = require('video.js');
var Hls = require('hls.js');
var hlsjs_source_handler = require('videojs5-hlsjs-source-handler');

module.exports = function(){
    hlsjs_source_handler.attach(window, videojs, Hls);
};
