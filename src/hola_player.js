'use strict';
var videojs = window.videojs = require('video.js');
require('./css/videojs.css'); // auto injected
var mime = require('./mime.js');
var util = require('./util.js');
var hlsjs_source_handler = require('./hlsjs_source_handler.js');
var flashls_source_handler = require('./flashls_source_handler.js');
require('@hola.org/videojs-osmf');
var $ = require('jquery-browserify');
var url = require('url');

function load_deps(deps){
    deps = deps||{};
    if (deps['videojs-settings'])
        require('@hola.org/videojs-settings');
    if (deps['videojs-hola-skin'])
    {
        require('@hola.org/videojs-hola-skin');
        require('./css/videojs-hola-skin.css');
    }
    if (deps['videojs-thumbnails'])
    {
        require('@hola.org/videojs-thumbnails');
        require('./css/videojs-thumbnails.css');
    }
    if (deps['videojs-contrib-ads'])
    {
        require('videojs-contrib-ads');
        require('./css/videojs-contrib-ads.css');
    }
    if (deps['videojs-ima'])
    {
        require('videojs-ima');
        require('./css/videojs-ima.css');
    }
}

var swf_urls = {
    videojs: './videojs.swf',
    'videojs-osmf': './videojs-osmf.swf',
};

(function(){
    hlsjs_source_handler();
    flashls_source_handler();
    load_cdn_loader();
    // XXX michaelg the defaults interfere with player opening
    $('.vjs-styles-defaults').remove();
    var player = new Player();
    // XXX bahaa: change to module.exports
    window.hola_player = function(cb){ return cb && cb(player); };
    window.hola_player.VERSION = '__VERSION__';
})();

function Player(){}
Player.prototype.init = function(opt, cb){
    if (typeof opt=='function')
    {
        cb = opt;
        opt = {};
    }
    this.ready_cb = cb;
    this.opt = opt = opt||{};
    if (!(this.element = this.init_element()))
        return cb && cb(null);
    this.init_vjs();
};

Player.prototype.init_element = function(){
    var opt = this.opt, cb = this.ready_cb;
    var element = opt.player ? $(opt.player)[0] :
        document.querySelector('video, object, embed');
    var $element = $(element);
    // special case when using a div container or flash object - create
    // video tag instead
    // XXX gilad/alexeym: unify with in loader.js,
    // it should not be in player itself.
    if ($element.is('div') || $element.is('object'))
    {
        var $video = $('<video>', {
            id: util.unique_id('hola_player'),
            class: 'video-js',
            preload: opt.preload||'auto',
            poster: opt.poster,
        });
        opt.player = '#'+$video.attr('id');
        var sources = opt.sources;
        if (!(opt.video_url || sources && sources.length))
            return null;
        if (sources && sources.length)
        {
            sources = sources.map(function(source){
                var url = source.src||source.file;
                return {
                    src: url,
                    type: source.type||mime.guess_link_type(url),
                };
            });
        }
        else
        {
            sources = [{
                src: opt.video_url,
                type: opt.video_type||mime.guess_link_type(opt.video_url),
            }];
        }
        $video.append(sources.map(function(source){
            return $('<source>', source);
        }));
        var position = $element.css('position');
        $video.css({
            position: position=='static' ? 'relative' : position,
            left: $element.css('left'),
            top: $element.css('top'),
        }).attr({
            width: opt.width||$element.width(),
            height: opt.height||$element.height(),
        }).insertAfter(element);
        $element.hide();
        return $video[0];
    }
    if ($element.is('video'))
    {
        element.controls = false;
        if (!opt.sources)
        {
            opt.sources = $element.find('source').map(function(){
                var source = $(this);
                return {src: source.attr('src'), type: source.attr('type'),
                    label: source.attr('label'),
                    default: !!source.attr('default')};
            }).get();
        }
        // with Hola player wrapper there is no autoSetup mode
        // XXX: maybe we should merge data-setup conf with vjs_opt
        $element.removeAttr('data-setup');
        // XXX bahaa: find a better solution
        reset_native_hls(element, opt.sources);
        return element;
    }
};

Player.prototype.init_vjs = function(){
    var hola_player = this, opt = hola_player.opt, cb = hola_player.ready_cb;
    var tech_order = opt.tech=='flash' ?
        ['flash', 'html5'] : ['html5', 'flash'];
    tech_order.push('osmf');
    // XXX arik: unite swf to one
    var vjs_opt = {
        osmf: {swf: swf_urls['videojs-osmf']},
        flash: {
            swf: swf_urls.videojs,
            accelerated: opt.accelerated,
        },
        html5: {
            hlsjsConfig: {
                fragLoadingLoopThreshold: 1000,
                manifestLoadingTimeOut: 20*1000,
                manifestLoadingMaxRetry: 4,
                levelLoadingTimeOut: 20*1000,
                levelLoadingMaxRetry: 4,
                xhrSetup: opt.withCredentials && function(xhr){
                    xhr.withCredentials = true;
                },
            },
        },
        inactivityTimeout: opt.inactivity_timeout===undefined ?
            2000 : opt.inactivity_timeout,
        autoplay: opt.auto_play,
        poster: opt.poster,
        techOrder: tech_order,
        tooltips: true,
        plugins: {
            settings: false,
            hola_skin: opt.skin ? false : {
                css: false,
                no_play_transform: opt.no_play_transform,
                show_controls_before_start: opt.show_controls_before_start,
            },
        },
    };
    if (opt.sources)
        vjs_opt.sources = opt.sources;
    else if (opt.video_url)
    {
        vjs_opt.sources = [{
            src: opt.video_url,
            type: opt.video_type||mime.guess_link_type(opt.video_url)
        }];
    }
    var settings_options = opt.settings;
    if (settings_options===undefined || settings_options===true)
        settings_options = {info: true, report: true, quality: false};
    if (settings_options!==false)
    {
        if (settings_options.quality)
            settings_options.quality = {sources: vjs_opt.sources||[]};
        settings_options.graph = opt.graph;
        settings_options.volume = opt.volume;
        vjs_opt.plugins.settings = settings_options;
    }
    vjs_opt = videojs.mergeOptions(vjs_opt, opt.videojs_options);
    load_deps({
        'videojs-settings': !!vjs_opt.plugins.settings,
        'videojs-hola-skin': !!vjs_opt.plugins.hola_skin,
        'videojs-thumbnails': !!opt.thumbnails,
        'videojs-contrib-ads': !!opt.ads,
        'videojs-ima': !!opt.ads,
    });
    var play_fired = false;
    videojs(hola_player.element, vjs_opt, function(){
        var player = this;
        player.controls(true);
        player.controlBar.show();
        if (opt.thumbnails)
            player.thumbnails(opt.thumbnails);
        player.on('play', function(){
            play_fired = true;
            player.bigPlayButton.hide();
        }).on('pause', function(e){
            if (player.scrubbing())
                e.stopImmediatePropagation();
            if (opt.big_pause_btn)
                player.bigPlayButton.show();
        }).on('ended', function(){
            // in this state videojs-contrib-ads catches the event, stops
            // it, triggers 'contentended' instead, re-triggers it when
            // post-roll is done or nonexistent.
            // so we ignore it in this stage and handle the next one, else
            // we will interfere with post-roll playback
            if (player.ads && player.ads.state=='content-playback')
                return;
            player.posterImage.show();
            player.bigPlayButton.show();
            if (!player.paused())
                player.pause();
            player.currentTime(0);
        }).on('problem_report', function(e){
            // XXX bahaa: TODO
        }).on('cdn_graph_overlay', function(e){
            // XXX bahaa: TODO
        }).on('save_logs', function(e){
            // XXX bahaa: TODO
        });
        if (cb)
            try { cb(player); } catch(e){ console.err(e.stack||e); }
        // repeat 'play' event for autoplay==true cases
        setTimeout(function(){
            if (!player.paused() && !play_fired)
                player.trigger('play');
        });
    });
};

function reset_native_hls(el, sources){
    var is_hls = function(e){ return mime.is_hls_link(e.src); };
    // not using el.currentSrc because it might not be selected yet.
    if (!el.canPlayType('application/x-mpegurl') || !sources.some(is_hls))
        return;
    // if source is hls and browser supports hls natively reset video element
    // so videojs will select our hls source handler instead of native.
    el.src = '';
    el.load();
}

function load_cdn_loader(){
    var script = util.current_script();
    if (!script)
        return;
    var customer = url.parse(script.src, true, true).query.customer;
    if (!customer)
        return;
    if (document.querySelector('script[src*="//player.h-cdn.com/loader"]'))
    {
        console.warn('Hola loader.js is included with Hola Player. '
            +'There is no need to load it separately');
        return;
    }
    console.log('Adding CDN loader...');
    util.load_script('//player.h-cdn.com/loader.js?customer='+customer,
        undefined, {async: true, crossOrigin: 'anonymous'});
}
