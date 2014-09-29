'use strict';

var pkg = require('./package.json');

var createFolderGlobs = function(fileTypePatterns) {
  fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
  var ignore = ['node_modules','bower_components','dist','temp'];
  var fs = require('fs');
  return fs.readdirSync(process.cwd())
  .map(function(file){
    if (ignore.indexOf(file) !== -1 ||
      file.indexOf('.') === 0 ||
      !fs.lstatSync(file).isDirectory()) {
      return null;
  } else {
    return fileTypePatterns.map(function(pattern) {
      return file + '/**/' + pattern;
    });
  }
})
  .filter(function(patterns){
    return patterns;
  })
  .concat(fileTypePatterns);
};

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    connect: {
      main: {
        options: {
          port: 9001
        }
      }
    },
    watch: {
      main: {
        options: {
          livereload: true,
          livereloadOnError: false,
          spawn: false
        },
        files: [createFolderGlobs(['*.js','*.less','*.html']),'!_SpecRunner.html','!.grunt'],
      }
    },
    jshint: {
      main: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: createFolderGlobs('*.js')
      }
    },
    clean: {
      before:{
        src:['dist','temp']
      },
      after: {
        src:['temp']
      }
    },
    less: {
      production: {
        options: {
        },
        files: {
          'temp/app.css': 'app.less'
        }
      }
    },
    ngtemplates: {
      main: {
        options: {
          module: pkg.name,
          htmlmin:'<%= htmlmin.main.options %>'
        },
        src: [createFolderGlobs('*.html'),'!index.html','!_SpecRunner.html'],
        dest: 'temp/templates.js'
      }
    },
    copy: {
      main: {
        files: [
        {src: ['img/**'], dest: 'dist/'},
        {src: ['bower_components/font-awesome/fonts/**'], dest: 'dist/',filter:'isFile',expand:true}
        ]
      }
    },
    dom_munger:{
      read: {
        options: {
          read:[
          {selector:'script[data-concat!="false"]',attribute:'src',writeto:'appjs'},
          {selector:'link[rel="stylesheet"][data-concat!="false"]',attribute:'href',writeto:'appcss'}
          ]
        },
        src: 'index.html'
      },
      update: {
        options: {
          remove: ['script[data-remove!="false"]','link[data-remove!="false"]'],
          append: [
          {selector:'body',html:'<script src="app.full.min.js"></script>'},
          {selector:'head',html:'<link rel="stylesheet" href="app.full.min.css">'}
          ]
        },
        src:'index.html',
        dest: 'dist/index.html'
      }
    },
    cssmin: {
      main: {
        src:['temp/app.css','<%= dom_munger.data.appcss %>'],
        dest:'dist/app.full.min.css'
      }
    },
    concat: {
      main: {
        src: ['<%= dom_munger.data.appjs %>','<%= ngtemplates.main.dest %>'],
        dest: 'temp/app.full.js'
      }
    },
    ngmin: {
      main: {
        src:'temp/app.full.js',
        dest: 'temp/app.full.js'
      }
    },
    uglify: {
      main: {
        src: 'temp/app.full.js',
        dest:'dist/app.full.min.js'
      }
    },
    htmlmin: {
      main: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },
    imagemin: {
      main:{
        files: [{
          expand: true, cwd:'dist/',
          src:['**/{*.png,*.jpg}'],
          dest: 'dist/'
        }]
      }
    },
    karma: {
      options: {
        frameworks: ['jasmine'],
        '<%= dom_munger.data.appjs %>',
        'bower_components/angular-mocks/angular-mocks.js',
        createFolderGlobs('*-spec.js')
        ],
        logLevel:'ERROR',
        reporters:['mocha'],
        singleRun: true
      },
      all_tests: {
        browsers: ['PhantomJS','Chrome','Firefox']
      },
      during_watch: {
        browsers: ['PhantomJS']
      },
    }
  });

grunt.registerTask('build',['jshint','clean:before','less','dom_munger','ngtemplates','cssmin','concat','ngmin','uglify','copy','htmlmin','imagemin','clean:after']);
grunt.registerTask('serve', ['dom_munger:read','jshint','connect', 'watch']);
grunt.registerTask('test',['dom_munger:read','karma:all_tests']);
grunt.registerTask('up', ['connect', 'watch']);

grunt.event.on('watch', function(action, filepath) {

  var tasksToRun = [];

  if (filepath.lastIndexOf('.js') !== -1 && filepath.lastIndexOf('.js') === filepath.length - 3) {

    grunt.config('jshint.main.src', filepath);
    tasksToRun.push('jshint');

    var spec = filepath;
    if (filepath.lastIndexOf('-spec.js') === -1 || filepath.lastIndexOf('-spec.js') !== filepath.length - 8) {
      spec = filepath.substring(0,filepath.length - 3) + '-spec.js';
    }

    if (grunt.file.exists(spec)) {
      var files = [].concat(grunt.config('dom_munger.data.appjs'));
      files.push('bower_components/angular-mocks/angular-mocks.js');
      files.push(spec);
      grunt.config('karma.options.files', files);
      tasksToRun.push('karma:during_watch');
    }
  }

  if (filepath === 'index.html') {
    tasksToRun.push('dom_munger:read');
  }

  grunt.config('watch.main.tasks',tasksToRun);

});
};
