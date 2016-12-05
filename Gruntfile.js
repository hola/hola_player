module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: ['src/*.js'],
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true,
                },
                transform: [
                    ['browserify-versionify', {
                        placeholder: '__VERSION__',
                        version: pkg.version,
                    }],
                    'browserify-css',
                ],
            },
            watch: {
                options: {
                    watch: true,
                    keepAlive: true,
                },
                files: {
                    'dist/hola_player.js': ['src/hola_player.js'],
                },
            },
            dist: {
                files: {
                    'dist/hola_player.js': ['src/hola_player.js'],
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
            all : {
                files: {
                    'dist/hola_player.min.js' : 'dist/hola_player.js',
                },
            },
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('build',
        ['jshint', 'browserify:dist', 'copy', 'uglify']);
    grunt.registerTask('default', ['build']);
};
