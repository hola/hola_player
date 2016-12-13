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
    if (script = document.currentScript)
        return script;
    if (script = document.querySelector(
        'script[src*="//player.h-cdn.com/player/hola_player"'))
    {
        return script;
    }
    // assumes wasn't loaded async
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length-1];
};

var id_counter = 0;
var rand = Math.floor(Math.random()*10000)+'';
E.unique_id = function(prefix){
    return (prefix ? prefix+'_' : '')+rand+'_'+(++id_counter);
};
