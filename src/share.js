'use strict';
var vjs = require('video.js');
var fs = require('fs');
var services = {
    facebook: {
        text: 'Facebook',
        link: 'https://www.facebook.com/sharer/sharer.php?u={url}',
        svg: fs.readFileSync('./src/img/facebook.svg', 'utf8'),
        popup: {width: 560, height: 610},
    },
    twitter: {
        text: 'Twitter',
        link: 'https://twitter.com/intent/tweet?url={url}&text={title}',
        svg: fs.readFileSync('./src/img/twitter.svg', 'utf8'),
        popup: {width: 500, height: 260},
    },
    'google+': {
        text: 'Google+',
        link: 'https://plus.google.com/share?url={url}',
        svg: fs.readFileSync('./src/img/google+.svg', 'utf8'),
        popup: {width: 400, height: 500},
    },
    blogger: {
        text: 'Blogger',
        link: 'https://www.blogger.com/blog-this.g?u={url}&n={title}',
        svg: fs.readFileSync('./src/img/blogger.svg', 'utf8'),
        popup: {width: 705, height: 455},
    },
    reddit: {
        text: 'Reddit',
        link: 'https://reddit.com/submit?url={url}',
        svg: fs.readFileSync('./src/img/reddit.svg', 'utf8'),
        popup: {width: 860, height: 770},
    },
    tumblr: {
        text: 'Tumblr',
        link: 'https://www.tumblr.com/widgets/share/tool?canonicalUrl={url}',
        svg: fs.readFileSync('./src/img/tumblr.svg', 'utf8'),
        popup: {width: 600, height: 500},
    },
    vk: {
        text: 'VK',
        link: 'https://vk.com/share.php?url={url}',
        svg: fs.readFileSync('./src/img/vk.svg', 'utf8'),
        popup: {width: 650, height: 580},
    },
    linkedin: {
        text: 'LinkedIn',
        link: 'https://www.linkedin.com/shareArticle?url={url}&title={title}',
        svg: fs.readFileSync('./src/img/linkedin.svg', 'utf8'),
        popup: {width: 550, height: 470},
    },
    email: {
        text: 'Email',
        link: 'mailto:?body={url}',
        svg: fs.readFileSync('./src/img/email.svg', 'utf8'),
    },
};

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
    createEl: function(){
        var el = Button.prototype.createEl.apply(this, arguments);
        el.appendChild(vjs.createEl('div', {
            className: 'vjs-button-icon',
            innerHTML: fs.readFileSync('./src/img/share.svg', 'utf8'),
        }));
        return el;
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
        var all_btns = Object.keys(services);
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
        var item = services[this.type_];
        this.controlText(item.text);
        this.addClass('vjs-share-'+this.type_);
        var url = this.options_.url||get_top_url();
        this.href = item.link
            .replace('{url}', encodeURIComponent(url))
            .replace('{title}', encodeURIComponent(this.options_.title||''));
        this.link = vjs.createEl('a', {className: 'vjs-share-link',
            innerHTML: item.svg}, {target: this.type_!='email' ? '_blank' : '',
            href: this.href});
        this.link.addEventListener('touchstart', function(e){
            e.stopPropagation(); });
        this.link.addEventListener('click', this.on_click.bind(this));
        this.el_.appendChild(this.link);
    },
    on_click: function(e){
        var item = services[this.type_], popup;
        if (!(popup = item.popup))
            return;
        e.preventDefault();
        window.open(this.href, this.type_,'left=20,top=20,height='+
            popup.height+',width='+popup.width+',resizable=1');
    },
}));
