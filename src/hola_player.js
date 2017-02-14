'use strict';
var videojs = window.videojs = require('video.js');
require('./css/videojs.css'); // auto injected
var mime = require('./mime.js');
var util = require('./util.js');
var hlsjs_source_handler = require('./hlsjs_source_handler.js');
var flashls_source_handler = require('./flashls_source_handler.js');
var url = require('url');

(function(){
    hlsjs_source_handler();
    flashls_source_handler();
    load_cdn_loader();
})();

var E = window.hola_player = module.exports = hola_player;
E.VERSION = '__VERSION__';
E.players = {};

function hola_player(opt, ready_cb){
    if (typeof opt=='function')
    {
        ready_cb = opt;
        opt = {};
    }
    opt = videojs.mergeOptions(opt); // clone
    var pl = opt.player && typeof opt.player!='string' && opt.player.length
        ? opt.player[0] : opt.player;
    var element = !pl ? document.querySelector('video, object, embed') :
        videojs.isEl(pl) ? pl : document.querySelector(pl);
    if (!element)
        return null;
    if (element.hola_player)
        return element.hola_player;
    if (opt = set_defaults(element, opt))
        return new Player(element, opt, ready_cb);
}

function set_defaults(element, opt){
    opt.auto_play = opt.auto_play || opt.autoplay; // allow both
    if (opt.video_url)
    {
        opt.sources = [{
            src: opt.video_url,
            type: opt.video_type||mime.guess_link_type(opt.video_url),
        }];
    }
    else if (opt.sources && !opt.sources.length)
        opt.sources = undefined;
    if (['VIDEO', 'DIV', 'OBJECT', 'EMBED'].indexOf(element.tagName)<0)
        return;
    if (element.tagName=='VIDEO' && !opt.sources)
    {
        var sources = element.querySelectorAll('source');
        if (!sources.length)
            return;
        opt.sources = Array.prototype.map.call(sources, function(source){
            return {
                src: source.getAttribute('src'),
                type: source.getAttribute('type'),
                label: source.getAttribute('label'),
                default: !!source.getAttribute('default')
            };
        });
    }
    return opt.sources && opt;
}

function load_deps(deps){
    deps = deps||{};
    require('@hola.org/videojs-osmf');
    require('@hola.org/videojs-contrib-media-sources');
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
        require('@hola.org/videojs-contrib-ads');
        require('./css/videojs-contrib-ads.css');
    }
    if (deps['videojs-ima'])
    {
        require('@hola.org/videojs-ima');
        require('./css/videojs-ima.css');
    }
    if (deps['videojs-contrib-dash'])
    {
        window.dashjs = {
            MediaPlayer: require('dashjs/dist/dash.mediaplayer.debug.js'),
        };
        require('videojs-contrib-dash');
    }
}

// XXX bahaa: make these easily replacable for self-hosting
var swf_urls = {
    videojs:
        'http://player.h-cdn.com/player/swf/__VIDEOJS_SWF_VERSION__/'+
        'videojs.swf',
    'videojs-osmf':
        'http://player.h-cdn.com/player/swf/osmf/__VIDEOJS_OSMF_VERSION__/'+
        'videojs-osmf.swf',
};

function Player(element, opt, ready_cb){
    this.ready_cb = ready_cb;
    this.opt = opt;
    this.element = this.init_element(element);
    this.vjs = this.init_vjs();
    E.players[this.id = this.vjs.id()] = this;
}

Player.prototype.init_element = function(element){
    var opt = this.opt;
    if (element.tagName=='VIDEO')
    {
        element.autoplay = false;
        element.controls = false;
        // with Hola player wrapper there is no autoSetup mode
        // XXX: maybe we should merge data-setup conf with vjs_opt
        element.removeAttribute('data-setup');
        // XXX bahaa: find a better solution
        reset_native_hls(element, opt.sources);
    }
    else
    {
        // special case when using a div container or flash object - create
        // video tag instead
        var style = window.getComputedStyle(element);
        var attrs = {
            id: util.unique_id('hola_player'),
            class: 'video-js',
            preload: opt.preload||'auto',
            width: opt.width||parseFloat(style.width),
            height: opt.height||parseFloat(style.height),
        };
        if (opt.poster)
            attrs.poster = opt.poster;
        var videoel = videojs.createEl('video', {}, attrs);
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
        element.hola_player = this;
        element = videoel;
    }
    if (!element.id)
        element.id = util.unique_id('hola_player');
    element.hola_player = this;
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
        'videojs-contrib-dash': opt.sources.some(function(s){
            return mime.is_dash_link(s.src) || mime.is_dash_type(s.type);
        }),
    });
    return videojs(this.element, vjs_opt, function(){
        var player = this;
        if (player.tech_)
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
        }).on('save_logs', function(e){
            // XXX bahaa: TODO
        }).on('problem_report', function(e){
            // XXX bahaa: TODO
        }).on('cdn_graph_overlay', on_cdn_graph_overlay);
        if (cb)
            try { cb(player); } catch(e){ console.error(e.stack||e); }
        if (opt.auto_play &&
            !videojs.browser.IS_ANDROID && !videojs.browser.IS_IOS)
        {
            player.play();
            player.autoplay(true);
        }
    }).on('error', function (){
        var player = this;
        var error = player.error;
        if (!error || error.code!=error.MEDIA_ERR_SRC_NOT_SUPPORTED)
            return;
        var only_flash = opt.sources.every(function(s){
            return mime.is_hds_link(s.src) || mime.is_flv_link(s.src);
        });
        var flash = videojs.getTech('Flash');
        var modal = player.getChild('errorDisplay');
        if (modal && only_flash && (!flash || !flash.isSupported()))
            modal.fillWith('Flash plugin is required to play this media');
    });
};

function on_cdn_graph_overlay(){
    var hola_cdn = window.hola_cdn;
    var bws = hola_cdn && hola_cdn._get_bws();
    if (window.cdn_graph || !bws || hola_cdn._get_mode()!='cdn')
        return;
    try {
        var ldr = hola_cdn.get_wrapper().loader;
        var gopt = {
            graph: 'newgraph_progress_mode_highlight_tips',
            player_obj: bws.player,
            video: bws.player.vjs
        };
        var url = '//player.h-cdn.com'+hola_cdn.require.zdot('cdngraph_js');
        ldr.util.load_script(url, function(){
            window.cdn_graph.init(gopt, bws, ldr); });
    } catch(err){ console.error(err.stack||err); }
}

Player.prototype.get_settings_opt = function(){
    var opt = this.opt, s = opt.settings;
    if (s===false)
        return;
    if (s===undefined || s===true)
        s = {info: true, report: true};
    if (s.quality || s.quality===undefined)
        s.quality = {sources: opt.sources};
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
    var hide_container = function(){
        // avoid it eating clicks while ad isn't playing
        if (player.ima.adContainerDiv)
            player.ima.adContainerDiv.style.display = 'none';
    };
    var opt = this.opt;
    if (!opt.ads)
        return;
    if (!opt.ads.adTagUrl && !opt.ads.adsResponse) // bad params
        return console.error('missing Ad Tag');
    if (!window.google) // missing external <script> or blocked by AdBlocker
        return console.error('missing IMA HTML5 SDK');
    if (!player.ads || !player.ima) // shouldn't happen as they're bundled
        return console.error('missing ad modules');
    player.ima(videojs.mergeOptions({
        id: player.id(),
        contribAdsSettings: {
            prerollTimeout: 1000,
            postrollTimeout: 1000,
            disablePlayContentBehindAd: true,
        },
    }, opt.ads));
    if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS)
        player.one('touchend', function(){ player.ima.requestAds(); });
    else
        player.ima.requestAds();
    hide_container();
};

function reset_native_hls(el, sources){
    var is_hls = function(s){
        return mime.is_hls_link(s.src) || mime.is_hls_type(s.type); };
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
