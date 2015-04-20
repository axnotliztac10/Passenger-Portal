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
                cwd: "build/webapp",
                src: "**/*"
            }
        },
        copy: {
            bower: { files: [{ expand: true, cwd: 'bower_components/', src: ['**/*'], dest: 'build/webapp/bower_components'}] },
            assets: { src: 'assets/css/*', dest: 'build/webapp/' },
            index: { src: 'index.html', dest: 'build/webapp/'},
            appFile: { src: 'app.js', dest: 'build/webapp/'},
            app: { files: [{ expand: true, cwd: 'app/', src: ['**/*'], dest: 'build/webapp/app'}] },
            images: { files: [{ expand: true, cwd: 'assets/imgs/', src: ['**/*'], dest: 'build/webapp/assets/imgs/'}] }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-aws');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('local', ['less', 'copy', 'connect']);
    grunt.registerTask('deploy', ['less', 'copy', 's3']);
};