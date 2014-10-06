'use strict';

var pkg = require('./package.json');

module.exports = function(grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9001,
                    keepalive: true
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ["bower_components"]
                },
                files: {"assets/css/app.css": "assets/css/app.less"}
            },
            production: {
                options: {
                    paths: ["bower_components"]
                },
                files: {"assets/css/app.css": "assets/css/app.less"}
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['less', 'connect']);
};