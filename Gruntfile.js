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
            production: {
                options: {
                    paths: ["bower_components"],
                    compress: true
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
            assets: { files: [{ expand: true, cwd: 'assets/css/', src: ['app.css'], dest: 'build/webapp/'}] },
            index: { src: 'index.html', dest: 'build/webapp/'},
            appviews: { files: [{ expand: true, cwd: 'app/views/', src: ['**/*'], dest: 'build/webapp/app/views'}] },
            images: { files: [{ expand: true, cwd: 'assets/imgs/', src: ['**/*'], dest: 'build/webapp/assets/imgs/'}] },
            fonts: { files: [{ expand: true, cwd: 'bower_components/bootstrap/fonts/', src: ['*'], dest: 'build/webapp/assets/fonts/'}] },
            icons: { files: [{ expand: true, cwd: 'assets/brands/<%= brand %>', src: ['*'], dest: 'build/webapp/assets/icons'}] }
        },
        concat: {
            options: {
                separator: ';\n',
                stripBanners: true
            },
            js: {
                src: [
                    'bower_components/jquery/jquery.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/underscore/underscore-min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
                    'bower_components/angular-resource/angular-resource.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                    'bower_components/angular-slider-touch/slider.js',
                    'bower_components/angular-facebook/lib/angular-facebook.js',
                    'bower_components/angular-google-plus/dist/angular-google-plus.min.js',
                    'bower_components/angular-google-maps/dist/angular-google-maps.min.js',
                    'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
                    'bower_components/pubnub-angular/lib/pubnub-angular.js',
                    'bower_components/angular-loading-bar/build/loading-bar.js',
                    'app.js',
                    'app/controllers/homeController.js',
                    'app/controllers/timeController.js',
                    'app/controllers/dropController.js',
                    'app/controllers/driverController.js',
                    'app/controllers/confirmController.js',
                    'app/controllers/historyController.js',
                    'app/controllers/authController.js',
                    'app/controllers/organizationsController.js',
                    'app/controllers/paymentController.js',
                    'app/controllers/aboutController.js',
                    'app/factories/quoteFactory.js',
                    'app/factories/apiFactory.js',
                    'app/directives/mainDirectives.js'
                ],
                dest: 'build/webapp/libs.js',
            },
        },
        fileblocks: {
            dist: {
                options: {
                    removeFiles: true
                },
                src: 'build/webapp/index.html',
                blocks: {
                    app: {
                        src: 'libs.js',
                        cwd: 'build/webapp/'
                    },
                    styles: {
                        src: 'app.css',
                        cwd: 'build/webapp/'
                    }
                }
            }
        },
        clean: ["build/webapp/"],
        shell: {
            options: {
                stderr: false
            },
            deploy: {
                command: 'cd build/ && /Users/Axnotliztac/go_appengine/goapp deploy --oauth'
            },
            clean: {
                command: 'cd build/ && /Users/Axnotliztac/go_appengine/appcfg.py rollback . --oauth2'
            }
        },
        uglify: {
            js: {
                files: {
                    'build/webapp/libs.js': ['build/webapp/libs.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-aws');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-file-blocks');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    var brand = grunt.option('brand') || 'blueandshift';
    grunt.config.set('brand', brand);

    grunt.registerTask('appengine:deploy', ['shell:deploy']);
    grunt.registerTask('appengine:clean', ['shell:clean']);
    grunt.registerTask('local', ['clean','less', 'copy', 'concat', 'fileblocks','connect']);
    grunt.registerTask('deploy', ['less', 'copy', 's3']);
};