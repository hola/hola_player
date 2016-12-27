'use strict';
var videojs = require('video.js');
var mime = require('./mime.js');
var util = require('./util.js');

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
    var swf = tech.el_, manual_level = -1;
    function level_data(id, label){ return {id: id, label: label}; }
    function level_label(level) {
        if (level.height)
            return level.height + 'p';
        else if (level.width)
            return Math.round(level.width * 9 / 16) + 'p';
        else if (level.bitrate)
            return util.scaled_number(level.bitrate) + 'bps';
        else
            return 0;
    }
    function switch_quality(qualityId) {
        manual_level = qualityId;
        swf.vjs_setProperty('level', qualityId);
        update_quality();
    }
    function update_quality(){
        var levels = swf.hola_hls_get_levels();
        var list = [];
        if (levels.length>1)
            list.push(level_data(-1, 'auto'));
        for (var i=0; i<levels.length; i++)
            list.push(level_data(levels[i].index, level_label(levels[i])));
        tech.trigger('loadedqualitydata', {
            quality: {
                list: list,
                selected: manual_level,
                current: swf.vjs_getProperty('level'),
            },
            callback: switch_quality,
        });
    }
    function on_msg(e){
        // XXX bahaa: support multiple players
        if (e && e.data && e.data.id=='flashls.hlsEventLevelSwitch')
            update_quality();
    }
    this.dispose = function(){
        window.removeEventListener('message', on_msg);
        tech.flashlsProvider = undefined;
    };
    window.addEventListener('message', on_msg);
    tech.setSrc(source.src);
}
