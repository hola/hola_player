'use strict';
var E = module.exports;

E.load_script = function(url, onload, attrs){
    var script = document.createElement('script');
    script.src = url;
    script.onload = onload;
    if (attrs)
        Object.assign(script, attrs);
    if (document.getElementsByTagName('head').length)
        document.getElementsByTagName('head')[0].appendChild(script);
    else if (document.getElementsByTagName('body').length)
        document.getElementsByTagName('body')[0].appendChild(script);
    else if (document.head)
        document.head.appendChild(script);
};

E.current_script = function(){
    var script;
    if (script = document.querySelector(
        'script[src*="//player.h-cdn.com/player/"]') ||
        document.querySelector('script[src*="//player2.h-cdn.com/"]') ||
        document.querySelector(
        'script[src*="//cdn.jsdelivr.net/hola_player/"]') ||
        document.querySelector(
        'script[src*="//cdn.jsdelivr.net/npm/@hola.org/hola_player@"'))
    {
        return script;
    }
    if (script = document.currentScript)
        return script;
    // assumes wasn't loaded async
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length-1];
};

var id_counter = 0;
var rand = Math.floor(Math.random()*10000)+'';
E.unique_id = function(prefix){
    return (prefix ? prefix+'_' : '')+rand+'_'+(++id_counter);
};

E.scaled_number = function(num){
    if (num===undefined)
        return '';
    if (!num)
        return '0';
    var k = 1024;
    var sizes = ['', 'K', 'M', 'G', 'T', 'P'];
    var i = Math.floor(Math.log(num)/Math.log(k));
    num /= Math.pow(k, i);
    if (num<0.001)
        return '0';
    if (num>=k-1)
        num = Math.trunc(num);
    var str = num.toFixed(num<1 ? 3 : num<10 ? 2 : num<100 ? 1 : 0);
    return str.replace(/\.0*$/, '')+sizes[i];
};
