'use strict';
var videojs = require('video.js');
var mime = require('./mime.js');
var util = require('./util.js');
var some = require('lodash/some');

module.exports = function(){
    videojs.getComponent('Flash').registerSourceHandler({
        canHandleSource: function(source){
            if (mime.is_hls_type(source.type))
                return 'probably';
            else if (mime.is_hls_link(source.src))
                return 'maybe';
            return '';
        },
        handleSource: function(source, tech){
            if (tech.flashlsProvider)
                tech.flashlsProvider.dispose();
            return tech.flashlsProvider = new FlashlsProvider(source, tech);
        },
    }, 0);
};

function FlashlsProvider(source, tech){
    var swf = tech.el_, manual_level = -1, player_id = swf.id;
    var duration = 0, sliding_start = 0;
    var player = find_player(tech);
    var _this = this;
    this.avg_duration = 0;
    this.buffer = 0;
    function height_label(level){
        var height = level.height || Math.round(level.width * 9 / 16);
        return height ? height + 'p' : '';
    }
    function bitrate_label(level){
        return level.bitrate ? util.scaled_number(level.bitrate) + 'bps' : '';
    }
    function level_label(level, levels){
        var label = height_label(level);
        if (!label)
            return bitrate_label(level);
        var duplicated = some(levels, function(l){
            return l!=level && height_label(l)==label;
        });
        return  duplicated ? label+' '+bitrate_label(level) : label;
    }
    function switch_quality(qualityId){
        manual_level = qualityId;
        swf.vjs_setProperty('level', qualityId);
        update_quality();
    }
    function update_quality(){
        var levels = swf.hola_hls_get_levels();
        var list = [];
        if (levels.length>1)
            list.push({id: -1, label: 'Auto'});
        for (var i=0; i<levels.length; i++)
        {
            list.push({id: levels[i].index, label: level_label(levels[i],
                levels), bitrate: levels[i].bitrate});
        }
        var data = tech.quality_data = {
            quality: {
                list: list,
                selected: manual_level,
                current: swf.vjs_getProperty('level'),
            },
            callback: switch_quality,
        };
        tech.trigger('loadedqualitydata', data);
    }
    function on_msg(e){
        if (!e || !e.data || e.data.player_id!=player_id)
            return;
        switch (e.data.id)
        {
        case 'flashls.hlsEventLevelSwitch':
            update_quality();
            break;
        case 'flashls.hlsEventManifestLoaded':
            var level = e.data.levels[0];
            duration = level.duration;
            _this.avg_duration = level.averageduration;
            break;
        case 'flashls.hlsEventMediaTime':
            sliding_start = e.data.mediatime.live_sliding_main;
            duration = e.data.mediatime.duration;
            _this.buffer = e.data.mediatime.buffer;
            break;
        }
    }
    function on_hola_attach(){ player_id = swf.hola_settings({}).player_id; }
    this.seekable = function(){
        if (!duration)
            return videojs.createTimeRanges([]);
        if (!player.dvr || !swf.hola_hls_get_type ||
            swf.hola_hls_get_type()!='LIVE')
        {
            return videojs.createTimeRanges([[0, duration]]);
        }
        return videojs.createTimeRanges([[sliding_start,
            duration + sliding_start - 3*_this.avg_duration]]);
    };
    this.dispose = function(){
        window.removeEventListener('message', on_msg);
        player.off('hola.wrapper_attached', on_hola_attach);
        tech.flashlsProvider = undefined;
    };
    window.addEventListener('message', on_msg);
    player.on('hola.wrapper_attached', on_hola_attach);
    tech.setSrc(source.src);
}

function find_player(tech){
    var players = videojs.getPlayers();
    for (var key in players)
    {
        var player = players[key];
        if (player.tech_===tech)
            return player;
    }
}
