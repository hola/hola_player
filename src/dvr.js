'use strict';
var vjs = require('video.js');

vjs.plugin('dvr', function(){
    var player = this;
    player.ready(function(){
        // XXX andrey: make it work with flashls
        if (!player.tech_.hlsProvider)
            return;
        player.controlBar.addClass('vjs-dvr');
        var progressControl = player.controlBar.progressControl;
        progressControl.removeChild('seekBar');
        progressControl.addChild('DvrSeekBar');
    });
    player.dvr = {
        range: function(){
            var seekable = player.seekable();
            return seekable && seekable.length ?
                {start: seekable.start(0), end: seekable.end(0)} : null;
        },
        is_live: function(){
            var range = player.dvr.range();
            var end = range && range.end;
            return end && player.currentTime() >= end;
        },
    };
});

var SeekBar = vjs.getComponent('SeekBar');
vjs.registerComponent('DvrSeekBar', vjs.extend(SeekBar, {
    options_: {
        children: ['loadProgressBar', 'mouseTimeDisplay', 'playProgressBar'],
        barName: 'playProgressBar'
    },
    constructor: function(player, options){
        SeekBar.call(this, player, options);
    },
    // XXX andrey: implement updateAriaAttributes, stepForward, stepBack
    getPercent: function(){
        var dvr = this.player_.dvr;
        var range = dvr.range();
        return (!range || dvr.is_live()) ? 1 :
            (this.player_.currentTime()-range.start) /
            (range.end-range.start);
    },
    handleMouseMove: function(event){
        var range = this.player_.dvr.range();
        if (!range)
            return;
        var time = range.start + this.calculateDistance(event) *
            (range.end-range.start);
        this.player_.currentTime(Math.min(time, range.end - 0.1));
    },
}));

// XXX andrey: implement custom PlayProgressBar
// XXX andrey: implement custom LoadProgressBar
// XXX andrey: implement custom MouseTimeDisplay
// XXX andrey: implement LiveButton
