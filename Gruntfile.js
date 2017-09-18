'use strict';
var path = require('path');
var require_transform = require('./transforms/require-transform.js');

function absolute(a){
    if (Array.isArray(a))
        return a.map(function(r){ return path.join(__dirname, r); });
    var ret = {};
    Object.keys(a).forEach(function(r){
        ret[path.join(__dirname, r)] = a[r]; });
    return ret;
}

module.exports = function(grunt) {
    require('time-grunt')(grunt);
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        clean: {
            dist: ['dist/*'],
            patched: ['src/hola_player.patched.js'],
        },
        jshint: {
            options: {jshintrc: '.jshintrc'},
            all: ['src/*.js', './*.js'],
        },
        replace: {
            dist: {
                src: ['src/hola_player.js'],
                dest: 'src/hola_player.patched.js',
                replacements: [{
                    from: 'require(\'@hola.org/hap.js/lib/hola_videojs_hls.js\')',
                    to: 'hola_vjs_provider_require()'
                }]
            }
        },
        browserify: {
            options: {
                browserifyOptions: {
                    standalone: 'hola_player',
                    debug: true,
                    noParse: absolute([
                        // avoid it requiring its own videojs
                        './node_modules/@hola.org/videojs-ima/src/videojs.ima.js',
                        // for faster build
                        './node_modules/video.js/dist/video.js',
                    ]),
                },
                transform: [
                    ['browserify-versionify', {
                        placeholder: '__VERSION__',
                        version: pkg.version,
                    }],
                    'browserify-css',
                    'brfs',
                    [require_transform, {
                        global: true,
                        shims: absolute({
                            './node_modules/@hola.org/videojs-ima/src/videojs.ima.js': {
                                'video.js': 'window.videojs',
                                'videojs-contrib-ads': 'null',
                            },
                            './node_modules/videojs-contrib-dash/es5/videojs-dash.js': {
                                'dashjs': 'window.dashjs',
                            },
                        }),
                    }],
                ],
                plugin: ['browserify-derequire'],
            },
            watch: {
                options: {
                    watch: true,
                    keepAlive: true,
                },
                files: {'dist/hola_player.dev.js': ['src/hola_player.js']},
            },
            vjs: {
                files: {'work/hola_vjs.dev.js':
                    ['./node_modules/@hola.org/hap.js/lib/hola_videojs_hls.js']
                },
            },
            dist: {
                files: {
                    'work/hola_player.dev.js': ['src/hola_player.patched.js'],
                },
                options: {
                    ignore: [
                        'videojs-contrib-dash',
                        './node_modules/@hola.org/dashjs/**'
                    ],
                },
            },
            dash: {
                files: {
                    'work/hola_player.dash.dev.js': ['src/hola_player.patched.js']
                },
            },
        },
        exorcise: {
            vjs: {
                files: {
                    'work/hola_vjs.dev.js.map': ['work/hola_vjs.dev.js'],
                },
            },
            dist: {
                files: {
                    'work/hola_player.dev.js.map': ['work/hola_player.dev.js'],
                },
            },
            dash: {
                files: {
                    'work/hola_player.dash.dev.js.map': ['work/hola_player.dash.dev.js'],
                },
            },
        },
        copy: {
            videojs: {
                src: 'node_modules/@hola.org/videojs-swf/dist/video-js.swf',
                dest: 'dist/videojs.swf',
            },
            'videojs-osmf': {
                src: 'node_modules/@hola.org/videojs-osmf/dist/videojs-osmf.swf',
                dest: 'dist/videojs-osmf.swf',
            },
        },
        uglify : {
            options: {sourceMap: true},
            vjs: {
                options: {sourceMapIn: 'work/hola_vjs.dev.js.map'},
                files: {'work/hola_vjs.js': 'work/hola_vjs.dev.js'},
            },
            dist: {
                options: {sourceMapIn: 'work/hola_player.dev.js.map'},
                files: {'work/hola_player.js': 'work/hola_player.dev.js'},
            },
            dash: {
                options: {sourceMapIn: 'work/hola_player.dash.dev.js.map'},
                files: {'work/hola_player.dash.js': 'work/hola_player.dash.dev.js'},
            },
        },
        concat: {
            options: {
                banner: `(function(){
var hola_vjs_provider_require, hola_player_api;
var E = hola_player_api = {};
E.zdot = function(name){
    // zdot_stub:
    // zdot_stub:return {
    // zdot_stub:customer: {[=json it.customer]},
    // zdot_stub:json: {[=json it.json]},
    // zdot_stub:}[name];
    return {}[name];
};
E.customer = E.zdot('customer');
E.disable = function(){};
function hola_player_init(){
`, separator: `
};
hola_vjs_provider_require = function(){
var res, define = function(name, fn){res=fn();};
define.amd = true;
// REQUIRE_START: hola_videojs_hls.js
`, footer: `
// REQUIRE_END: hola_videojs_hls.js
return res;
};
hola_player_init();
})();`, sourceMap: true,
            },
            dist: {
                files: {'dist/hola_player.js':
                    ['work/hola_player.js', 'work/hola_vjs.js'],
                    'dist/hola_player.dev.js':
                    ['work/hola_player.dev.js', 'work/hola_vjs.dev.js'],
                }
            },
            dash: {
                files: {'dist/hola_player.dash.js':
                    ['work/hola_player.dash.js', 'work/hola_vjs.js'],
                    'dist/hola_player.dash.dev.js':
                    ['work/hola_player.dash.dev.js', 'work/hola_vjs.dev.js'],
                }
            },
        },
        zip: {
            dist: {
                router: function(filepath){
                    return path.relative('dist', filepath);
                },
                src: ['dist/**/*'],
                dest: 'dist/hola-player-'+pkg.version+'.zip',
            },
        },
    });
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('chg');
    grunt.registerTask('build', ['clean', 'jshint', 'replace',
        'browserify:vjs', 'browserify:dist', 'browserify:dash',
        'clean:patched', 'exorcise', 'copy', 'uglify', 'concat', 'zip']);
    grunt.registerTask('default', ['build']);
};
