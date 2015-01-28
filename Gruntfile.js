'use strict';

var pkg = require('./package.json');

module.exports = function(grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 80,
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
        },
        aws: grunt.file.readJSON("credentials.json"),
        s3: {
            options: {
                accessKeyId: "<%= aws.accessKeyId %>",
                secretAccessKey: "<%= aws.secretAccessKey %>",
                bucket: "shiftportal"
            },
            build: {
                cwd: "../build/",
                src: "**/*"
            }
        },
        copy: {
            bower: { files: [{ expand: true, cwd: 'bower_components/', src: ['**/*'], dest: '../build/bower_components'}] },
            assets: { src: 'assets/css/*', dest: '../build/' },
            index: { src: 'index.html', dest: '../build/'},
            appFile: { src: 'app.js', dest: '../build/'},
            app: { files: [{ expand: true, cwd: 'app/', src: ['**/*'], dest: '../build/app'}] },
            images: { files: [{ expand: true, cwd: 'assets/imgs/', src: ['**/*'], dest: '../build/assets/imgs/'}] }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-aws');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('local', ['less', 'copy', 'connect']);
    grunt.registerTask('deploy', ['copy', 's3']);
};