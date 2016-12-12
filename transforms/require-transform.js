var transformTools = require('browserify-transform-tools');

var options = {
    jsFilesOnly: true,
    evaluateArguments: true
};

var fnTransform = function(args, opts, cb){
    var config = opts.config;
    var shims = (config.shims||{})[opts.file]||{};
    var dep = shims[args[0]];
    if (dep)
        return void cb(null, '('+dep+')');
    cb();
};

module.exports = transformTools.makeRequireTransform('require-transform',
    options, fnTransform);
