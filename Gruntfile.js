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
        },
        jshint: {
            options: {jshintrc: '.jshintrc'},
            all: ['src/*.js', './*.js'],
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true,
                    noParse: absolute([
                        // avoid it requiring its own videojs
                        './node_modules/videojs-ima/src/videojs.ima.js',
                        // for faster build
                        './node_modules/video.js/dist/video.js',
                        './node_modules/jquery-browserify/lib/jquery.js',
                    ]),
                },
                transform: [
                    ['browserify-versionify', {
                        placeholder: '__VERSION__',
                        version: pkg.version,
                    }],
                    'browserify-css',
                    [require_transform, {
                        global: true,
                        shims: absolute({
                            './node_modules/videojs-ima/src/videojs.ima.js': {
                                'video.js': 'window.videojs',
                                'videojs-contrib-ads': 'null',
                            },
                        }),
                    }],
                ],
            },
            watch: {
                options: {
                    watch: true,
                    keepAlive: true,
                },
                files: {'dist/hola_player.dev.js': ['src/hola_player.js']},
            },
            dist: {
                files: {'dist/hola_player.dev.js': ['src/hola_player.js']},
            },
        },
        exorcise: {
            dist: {
                options: {},
                files: {
                    'dist/hola_player.dev.js.map': ['dist/hola_player.dev.js'],
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
            options: {
                sourceMap: true,
                sourceMapIn: 'dist/hola_player.dev.js.map',
            },
            dist : {
                files: {'dist/hola_player.js' : 'dist/hola_player.dev.js'},
            },
        },
        zip: {
            dist: {
                router: function(filepath){
                    if (path.extname(filepath)=='.zip')
                        return null;
                    return path.relative('dist', filepath);
                },
                src: ['dist/**/*'],
                dest: 'dist/hola-player-'+ pkg.version+'.zip'
            },
        },
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('build', ['clean', 'jshint', 'browserify:dist',
        'exorcise', 'copy', 'uglify', 'zip']);
    grunt.registerTask('default', ['build']);
};
