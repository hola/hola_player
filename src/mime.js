'use strict';
var url = require('url');
var E = module.exports;

var mp4_suffix = /\.(mp4|m4p|m4v|mov)$/i;
var hls_suffix = /\.m3u8$/;
var hds_suffix = /\.f4m$/;
var dash_suffix = /\.mpd$/;
var flv_suffix = /\.flv$/;
var webm_suffix = /\.webm$/;
function is_rx_link(v, rx){
    return !!v && rx.test(url.parse(v).pathname.split(';')[0]); }
E.is_mp4_link = function(v){ return is_rx_link(v, mp4_suffix); };
E.is_hls_link = function(v){ return is_rx_link(v, hls_suffix); };
E.is_hds_link = function(v){ return is_rx_link(v, hds_suffix); };
E.is_dash_link = function(v){ return is_rx_link(v, dash_suffix); };
E.is_flv_link = function(v){ return is_rx_link(v, flv_suffix); };
E.is_webm_link = function(v){ return is_rx_link(v, webm_suffix); };
E.guess_link_type = function(v){
    var p = url && url.parse(v).pathname;
    if (mp4_suffix.test(p))
        return 'video/mp4';
    if (hls_suffix.test(p))
        return 'application/x-mpegurl';
    if (hds_suffix.test(p))
        return 'application/adobe-f4m';
    if (dash_suffix.test(p))
        return 'application/dash+xml';
    if (flv_suffix.test(p))
        return 'video/flv';
    if (webm_suffix.test(p))
        return 'video/webm';
    console.log('could not guess link type: "'+v+'" assuming mp4');
    return 'video/mp4';
};
E.is_hls_type = function(type){
    return /^application\/x-mpegurl$/i.test(type);
};
E.is_hds_type = function(type){
    return /^application\/adobe-f4m$/i.test(type);
};
E.is_dash_type = function(type){
    return /^application\/dash\+xml/i.test(type);
};
