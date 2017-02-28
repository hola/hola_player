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
        progressControl.seekBar = progressControl.addChild('DvrSeekBar');
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
        format_time: function(time){
            var range = player.dvr.range();
            if (!range)
                return '0:00';
            if (!time)
            {
                time = player.scrubbing() ? player.getCache().currentTime :
                    player.currentTime();
            }
            time = Math.max(range.end-time, 0);
            return (time > 0 ? '-' : '')+vjs.formatTime(time, range.end);
        },
    };
});

var SeekBar = vjs.getComponent('SeekBar');
vjs.registerComponent('DvrSeekBar', vjs.extend(SeekBar, {
    options_: {
        children: ['dvrLoadProgressBar', 'dvrMouseTimeDisplay',
            'dvrPlayProgressBar'],
        barName: 'dvrPlayProgressBar'
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

var PlayProgressBar = vjs.getComponent('PlayProgressBar');
vjs.registerComponent('DvrPlayProgressBar', vjs.extend(PlayProgressBar, {
    updateDataAttr: function(){
        this.el_.setAttribute('data-current-time',
            this.player_.dvr.format_time());
    },
}));

function el_pos(el){
    var box;
    if (el.getBoundingClientRect && el.parentNode)
        box = el.getBoundingClientRect();
    else
        return 0;
    var body = document.body;
    var client = document.documentElement.clientLeft || body.clientLeft || 0;
    var scroll = window.pageXOffset || body.scrollLeft;
    return Math.round(box.left + scroll - client);
}

var MouseTimeDisplay = vjs.getComponent('MouseTimeDisplay');
vjs.registerComponent('DvrMouseTimeDisplay', vjs.extend(MouseTimeDisplay, {
    handleMouseMove: function(event){
        var range = this.player_.dvr.range();
        var time = range ? this.calculateDistance(event) *
            (range.end-range.start) + range.start : 0;
        var max_left = this.player_.controlBar.progressControl.seekBar.width()-
            this.width();
        var pos = event.pageX - el_pos(this.el().parentNode);
        pos = Math.min(Math.max(0, pos), max_left);
        var tp_width = this.tooltip.offsetWidth;
        var max_tp_left = this.tooltip.parentNode.offsetWidth-tp_width;
        var tp_pos = event.pageX-el_pos(this.tooltip.parentNode)-tp_width/2;
        tp_pos = Math.min(Math.max(0, tp_pos), max_tp_left);
        this.update(time, pos, tp_pos);
    },
    update: function(time, pos, tp_pos){
        this.el().style.left = pos + 'px';
        this.tooltip.innerHTML = this.player_.dvr.format_time(time);
        if (this.keepTooltipsInside)
        {
            var diff = pos-this.clampPosition_(pos)+1;
            var width =
                parseFloat(window.getComputedStyle(this.tooltip).width);
            this.tooltip.style.left = 'auto';
            this.tooltip.style.right = '-' +(width/2-diff)+'px';
        }
        else
        {
            this.tooltip.style.right = 'auto';
            this.tooltip.style.left = tp_pos + 'px';
        }
    },
}));

var LoadProgressBar = vjs.getComponent('LoadProgressBar');
vjs.registerComponent('DvrLoadProgressBar', vjs.extend(LoadProgressBar, {
    constructor: function(player, options){
        LoadProgressBar.call(this, player, options);
        this.partEls_ = [];
        if (player.tech_.hls_obj)
            this.on(player.tech_.hls_obj, 'hlsLevelUpdated', this.update);
    },
    update: function(){
        var percentify = function(time, end){
            var percent = time / end || 0;
            return (percent >= 1 ? 1 : percent) * 100 + '%';
        };
        var range = this.player_.dvr.range();
        var start = range ? range.start : 0;
        var end = range ? range.end : 0;
        var children = this.partEls_;
        var buffered = this.player_.buffered();
        var buff = [];
        var i;
        for (i = 0; i < buffered.length; i++)
        {
            if (buffered.end(i)<=start || buffered.start(i)>=end)
                continue;
            buff.push({
                start: Math.max(buffered.start(i), start),
                end: Math.min(buffered.end(i), end),
            });
        }
        var total = buff.length ? buff[buff.length-1].end - start : 0;
        this.el_.style.width = percentify(total, end-start);
        for (i = 0; i < buff.length; i++)
        {
            children[i] = children[i] || this.el_.appendChild(vjs.createEl());
            var part = children[i];
            part.style.left = percentify(buff[i].start-start, total);
            part.style.width = percentify(buff[i].end-buff[i].start, total);
        }
        for (i = children.length; i > buff.length; i--)
            this.el_.removeChild(children[i-1]);
        children.length = buff.length;
    },
}));

// XXX andrey: implement LiveButton
