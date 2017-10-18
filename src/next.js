'use strict';
var vjs = require('video.js');
var fs = require('fs');
vjs.plugin('next', function(opt){
    var player = this;
    player.ready(function(){
        var b, controlBar = player.controlBar;
        b = controlBar.nextVideo = controlBar.addChild('nextButton', opt||{});
        b.on('mouseenter', function(){
            b.addClass('vjs-next-suggestion-show');
            player.trigger('next_suggestion_show');
        });
        b.on('mouseleave', function(){
            b.removeClass('vjs-next-suggestion-show');
            player.trigger('next_suggestion_hide');
        });
    });
});
var events = ['touchstart', 'touchend', 'click'];
var prevent_click = function(event){
    event.stopPropagation();
};
var Button = vjs.getComponent('Button');
vjs.registerComponent('NextButton', vjs.extend(Button, {
    controlText_: 'Next',
    constructor: function(player, options){
        Button.call(this, player, options);
        this.on(events, prevent_click);
    },
    createEl: function(){
        var el = Button.prototype.createEl.apply(this, arguments);
        el.appendChild(vjs.createEl('div', {
            className: 'vjs-button-icon',
            innerHTML: fs.readFileSync('./src/img/skip_next.svg', 'utf8'),
        }));
        return el;
    },
    buildCSSClass: function(){
        return 'vjs-next-button '+Button.prototype.buildCSSClass.call(this);
    },
    handleClick: function(event){
        this.player_.trigger('next_suggestion_play'); },
}));
