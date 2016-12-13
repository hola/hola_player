'use strict';
var videojs = window.videojs = require('video.js');
require('./css/videojs.css'); // auto injected
var mime = require('./mime.js');
var util = require('./util.js');
var hlsjs_source_handler = require('./hlsjs_source_handler.js');
var flashls_source_handler = require('./flashls_source_handler.js');
require('@hola.org/videojs-osmf');
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
    var element = opt.player ? document.querySelector(opt.player) :
        document.querySelector('video, object, embed');
    if (!element)
        return null;
    if (opt.sources && !opt.sources.length)
        opt.sources = undefined;
    if (opt.video_url)
    {
        opt.sources = [{
            src: opt.video_url,
            type: opt.video_type||mime.guess_link_type(opt.video_url),
        }];
    }
    // special case when using a div container or flash object - create
    // video tag instead
    // XXX gilad/alexeym: unify with in loader.js,
    // it should not be in player itself.
    if (element.tagName=='DIV' || element.tagName=='OBJECT' ||
        element.tagName=='EMBED')
    {
        if (!opt.sources)
            return null;
        var style = window.getComputedStyle(element);
        var videoel = videojs.createEl('video', {}, {
            id: util.unique_id('hola_player'),
            class: 'video-js',
            preload: opt.preload||'auto',
            poster: opt.poster,
            width: opt.width||parseFloat(style.width),
            height: opt.height||parseFloat(style.height),
        });
        videojs.appendContent(videoel, opt.sources.map(function(source){
            return videojs.createEl('source', {}, source);
        }));
        videoel.style.position = style.position=='static' ?
            'relative' : style.position;
        videoel.style.left = style.left;
        videoel.style.top = style.top;
        // $(videoel).insertAfter(element);
        element.parentNode.insertBefore(videoel, element.nextSibling);
        element.style.display = 'none';
        element = videoel;
    }
    else if (element.tagName=='VIDEO')
    {
        element.autoplay = false;
        element.controls = false;
        if (!opt.sources)
        {
            var sources = element.querySelectorAll('source');
            if (!sources.length)
                return null;
            opt.sources = Array.prototype.map.call(sources, function(source){
                return {
                    src: source.getAttribute('src'),
                    type: source.getAttribute('type'),
                    label: source.getAttribute('label'),
                    default: !!source.getAttribute('default')
                };
            });
        }
        // with Hola player wrapper there is no autoSetup mode
        // XXX: maybe we should merge data-setup conf with vjs_opt
        element.removeAttribute('data-setup');
        // XXX bahaa: find a better solution
        reset_native_hls(element, opt.sources);
    }
    if (!element.id)
        element.id = util.unique_id('hola_player');
    return element;
};

Player.prototype.init_vjs = function(){
    var opt = this.opt, cb = this.ready_cb, hola_player = this;
    var vjs_opt = this.get_vjs_opt();
    load_deps({
        'videojs-settings': !!vjs_opt.plugins.settings,
        'videojs-hola-skin': !!vjs_opt.plugins.hola_skin,
        'videojs-thumbnails': !!opt.thumbnails,
        'videojs-contrib-ads': !!opt.ads,
        'videojs-ima': !!opt.ads,
    });
    videojs(this.element, vjs_opt, function(){
        var player = this;
        player.controls(true);
        player.controlBar.show();
        if (opt.thumbnails)
            player.thumbnails(opt.thumbnails);
        hola_player.init_ads(player);
        player.on('play', function(){
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
        if (opt.auto_play)
        {
            player.play();
            player.autoplay(true);
        }
    });
};

Player.prototype.get_settings_opt = function(){
    var opt = this.opt, s = opt.settings;
    if (s===false)
        return;
    if (s===undefined || s===true)
        s = {info: true, report: true, quality: false};
    if (s.quality)
        s.quality = {sources: opt.sources||[]};
    s.graph = opt.graph;
    s.volume = opt.volume;
    return s;
};

Player.prototype.get_vjs_opt = function(){
    var opt = this.opt;
    return videojs.mergeOptions({
        sources: opt.sources,
        osmf: {swf: swf_urls['videojs-osmf']}, // XXX arik: unite swf to one
        flash: {
            swf: swf_urls.videojs,
            accelerated: opt.accelerated,
        },
        html5: {
            hlsjsConfig: {
                debug: false,
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
        poster: opt.poster,
        techOrder:
            (opt.tech=='flash' ? ['flash', 'html5'] : ['html5', 'flash'])
            .concat('osmf'),
        tooltips: true,
        plugins: {
            settings: this.get_settings_opt(),
            hola_skin: opt.skin ? false : {
                css: false,
                no_play_transform: opt.no_play_transform,
                show_controls_before_start: opt.show_controls_before_start,
            },
        },
    }, opt.videojs_options);
};

Player.prototype.init_ads = function(player){
    var opt = this.opt;
    if (!player.ads || !player.ima || !opt.ads ||
        !opt.ads.adTagUrl && !opt.ads.adsResponse)
    {
        return;
    }
    player.ima(videojs.mergeOptions({
        id: this.element.id,
        contribAdsSettings: {
            prerollTimeout: 1000,
            postrollTimeout: 1000,
        },
    }, opt.ads));
    player.ima.requestAds();
    // avoid it eating clicks while ad isn't playing
    if (player.ima.adContainerDiv)
        player.ima.adContainerDiv.style.display = 'none';
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
