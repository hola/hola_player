'use strict';
var vjs = require('video.js');

vjs.plugin('share', function(opt){
    var player = this;
    player.ready(function(){
        player.addChild('ShareButton', opt||{});
    });
});
var events = ['touchstart', 'touchend', 'click'];
var prevent_click = function(event){
    event.stopPropagation();
};
function get_top_url(){
    return window.top==window ? location.href : document.referrer;
}
var Button = vjs.getComponent('Button');
vjs.registerComponent('ShareButton', vjs.extend(Button, {
    controlText_: 'Share video',
    constructor: function(player, options){
        Button.call(this, player, options);
        this.on(events, prevent_click);
    },
    buildCSSClass: function(){
        return 'vjs-share-button '+Button.prototype.buildCSSClass.call(this);
    },
    handleClick: function(event){
        var player = this.player_;
        var modal = player.addChild('shareDialog', this.options_);
        this.on(modal, 'dispose', function(){
            player.removeChild(modal);
            this.show();
        });
        modal.open();
        this.hide();
    },
}));
var ModalDialog = vjs.getComponent('ModalDialog');
vjs.registerComponent('ShareDialog', vjs.extend(ModalDialog, {
    constructor: function(player, options){
        ModalDialog.call(this, player, options);
        this.on(events, prevent_click);
        this.on(this.getChild('closeButton'), events, prevent_click);
        this.options_.fillAlways = false;
        this.hasBeenFilled_ = true;
        var el = this.contentEl_;
        el.appendChild(vjs.createEl('div', {
            className: 'vjs-share-dialog-title',
            innerHTML: this.localize('Share video'),
        }));
        var btns_el = vjs.createEl('div', {
            className: 'vjs-share-dialog-buttons',
        });
        el.appendChild(btns_el);
        this.contentEl_ = btns_el;
        var all_btns = ['facebook', 'twitter', 'email'];
        var buttons = options.buttons || all_btns;
        var _this = this;
        buttons.forEach(function(b){
            if (all_btns.indexOf(b)==-1)
                return;
            _this.addChild('ShareLink', vjs.mergeOptions(_this.options_,
                {type: b}));
        });
        this.contentEl_ = el;
    },
    buildCSSClass: function(){
        return 'vjs-share-dialog '+
            ModalDialog.prototype.buildCSSClass.call(this);
    },
}));
var ClickableComponent = vjs.getComponent('ClickableComponent');
vjs.registerComponent('ShareLink', vjs.extend(ClickableComponent, {
    constructor: function(player, options){
        ClickableComponent.call(this, player, options);
        this.on(events, prevent_click);
        this.type_ = options.type;
        var map = {
            facebook: {text: 'Facebook',
                link: 'https://www.facebook.com/sharer/sharer.php?u=%s'},
            twitter: {text: 'Twitter',
                link: 'https://twitter.com/intent/tweet?url=%s'},
            email: {text: 'Email', link: 'mailto:?body=%s'},
        };
        var item = map[this.type_];
        this.controlText(item.text);
        this.addClass('vjs-share-'+this.type_);
        this.link = vjs.createEl('a', {className: 'vjs-share-link'}, {
            target: '_blank',
            href: !item.link ? '#' : item.link.replace('%s',
                encodeURIComponent(this.options_.url||get_top_url())),
        });
        this.link.addEventListener('touchstart', function(e){
            e.stopPropagation(); });
        this.el_.appendChild(this.link);
    },
}));
