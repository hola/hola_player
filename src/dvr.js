'use strict';
var vjs = require('video.js');
var throttle = require('lodash/throttle');
var get = require('lodash/get');

vjs.plugin('dvr', function(){
    var player = this;
    function remove_child(component, child_name){
        var child = component.getChild(child_name);
        component.removeChild(child);
        child.dispose();
    }
    function init(){
        var hls = player.tech_.hls_obj;
        var flashls = player.tech_.flashlsProvider;
        var seekable = player.seekable();
        if (!hls && !flashls || player.duration()!=Infinity || !seekable ||
            !seekable.length || (seekable.end(0)-seekable.start(0))<60)
        {
            return;
        }
        var progressControl = player.controlBar.progressControl;
        remove_child(progressControl, 'seekBar');
        progressControl.seekBar = progressControl.addChild('DvrSeekBar');
        remove_child(player.controlBar, 'liveDisplay');
        player.controlBar.addChild('LiveButton');
        player.controlBar.addClass('vjs-dvr');
        player.removeClass('vjs-live');
        player.on('durationchange', function(){
            player.removeClass('vjs-live');
        });
        if (!player.hasStarted())
            player.one('play', function(){ player.dvr.seek_to_live(); });
        player.on('timeupdate', function(){
            player.controlBar.toggleClass('vjs-dvr-live',
                player.dvr.is_live());
        });
        if (flashls)
            player.dvr.live_threshold = Math.max(flashls.avg_duration*1.5, 10);
        else
        {
            hls.on('hlsLevelUpdated', function(e, data){
                player.dvr.live_threshold =
                    Math.max(data.details.targetduration*1.5, 10);
            });
        }
    }
    player.ready(function(){
        var seekable = player.seekable();
        if (player.duration() && seekable && seekable.length)
            init();
        else
            player.one('loadedmetadata', function(){
                if (!player.tech_.flashlsProvider)
                {
                    init();
                    return;
                }
                player.on('timeupdate', function on_timeupdate(){
                    var seekable = player.seekable();
                    if (!seekable || !seekable.length)
                        return;
                    player.off('timeupdate', on_timeupdate);
                    init();
                });
            });
    });
    player.dvr = {
        live_threshold: 10,
        range: function(){
            var seekable = player.seekable();
            return seekable && seekable.length ?
                {start: seekable.start(0), end: seekable.end(0)} : null;
        },
        is_live: function(){
            var range = this.range();
            var end = range && range.end;
            return end && (end-player.currentTime()) <= this.live_threshold;
        },
        format_time: function(time){
            var range = this.range();
            if (!range)
                return '0:00';
            if (!time)
            {
                time = player.scrubbing() ? player.getCache().currentTime :
                    player.currentTime();
            }
            if (range.end-time < this.live_threshold)
                return player.localize('Live');
            time = Math.max(range.end-time, 0);
            return (time > 0 ? '-' : '')+vjs.formatTime(time, range.end);
        },
        seek_to_live: function(){
            var range = this.range();
            if (range && !this.is_live())
                player.currentTime(range.end);
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
        if (range.end-time < this.player_.dvr.live_threshold)
            this.player_.dvr.seek_to_live();
        else
            this.player_.currentTime(Math.min(time, range.end));
    },
    updateAriaAttributes: function(el){
        el.setAttribute('aria-valuenow', (this.getPercent() * 100).toFixed(2));
        el.setAttribute('aria-valuetext', this.player_.dvr.format_time());
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
var Component = vjs.getComponent('Component');
vjs.registerComponent('DvrMouseTimeDisplay', vjs.extend(MouseTimeDisplay, {
    constructor: function(player, options){
        Component.call(this, player, options);
        this.keepTooltipsInside = get(options,
            'playerOptions.controlBar.progressControl.keepTooltipsInside');
        if (this.keepTooltipsInside)
        {
            this.tooltip = vjs.createEl('div',
                {className: 'vjs-time-tooltip'});
            this.el().appendChild(this.tooltip);
            this.addClass('vjs-keep-tooltips-inside');
        }
        this.update(0, 0, 0);
        var progressEl = this.player_.controlBar.progressControl.el();
        progressEl.appendChild(this.tooltip);
        this.on(progressEl, 'mousemove',
            throttle(this.handleMouseMove.bind(this)), 25);
    },
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
        var flashls;
        if (player.tech_.hls_obj)
            this.on(player.tech_.hls_obj, 'hlsLevelUpdated', this.update);
        else if (flashls = player.tech_.flashlsProvider)
        {
            this.on(player, 'timeupdate', function(){
                this.update(flashls.buffer);
            });
        }
    },
    update: function(buffer){
        var percentify = function(time, end){
            var percent = time / end || 0;
            return (percent >= 1 ? 1 : percent) * 100 + '%';
        };
        var range = this.player_.dvr.range();
        var start = range ? range.start : 0;
        var end = range ? range.end : 0;
        var children = this.partEls_;
        var buff = [];
        var i;
        if (buffer)
        {
            var cur = this.player_.currentTime();
            buff = [{start: cur, end: cur+buffer}];
        }
        else
        {
            var buffered = this.player_.buffered();
            for (i = 0; i < buffered.length; i++)
            {
                if (buffered.end(i)<=start || buffered.start(i)>=end)
                    continue;
                buff.push({
                    start: Math.max(buffered.start(i), start),
                    end: Math.min(buffered.end(i), end),
                });
            }
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

var Button = vjs.getComponent('Button');
vjs.registerComponent('LiveButton', vjs.extend(Button, {
    controlText_: 'Skip back to live',
    createEl: function(){
        var el = Button.prototype.createEl.call(this, 'button', {
            className: 'vjs-live-control vjs-control',
        });
        this.contentEl_ = vjs.createEl('div', {
            className: 'vjs-live-display',
            innerHTML: this.localize('LIVE'),
        }, {
            'aria-live': 'off',
        });
        el.appendChild(this.contentEl_);
        return el;
    },
    handleClick: function(){
        this.player_.dvr.seek_to_live();
        this.player_.play();
    },
}));
