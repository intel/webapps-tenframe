module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadTasks('tools/grunt-tasks');

  grunt.initConfig({
    packageInfo: grunt.file.readJSON('package.json'),

    clean: ['build'],

    requirejs: {
      dist: {
        options: {
          baseUrl: './js',

          // include the main requirejs configuration file;
          // see notes in that file on the allowed format
          mainConfigFile: 'js/require-config.js',

          // main application module
          name: 'main',

          // output
          out: 'build/app.min.js',

          // we don't need to wrap the js in an anonymous function,
          // as our main.js runs the application
          wrap: false,

          // remove license comments from js files
          preserveLicenseComments: false,

          uglify: {
            beautify: false,
            toplevel: true,
            ascii_only: true,
            no_mangle: false,
            max_line_length: 1000
          }
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'build/app/lib/require.min.js': [ 'lib/requirejs/require.js' ]
        }
      },
      perf: {
        files: {
          'build/save-perf-data.min.js': [
            'tools/save-perf-data.js'
          ]
        }
      }
    },

    // concat minified almond with minified source
    concat: {
      dist: {
        files: {
          'build/app/js/all.js': [
            'build/app.min.js'
          ]
        }
      }
    },

    // minify and concat CSS
    cssmin: {
      dist: {
        files: {
          'build/app/css/all.css': ['css/*.css']
        }
      }
    },

    // copy files required for the wgt package
    copy: {
      common: {
        files: [
          { expand: true, cwd: '.', src: ['audio/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['fonts/**'], dest: 'build/app/' },
          { expand: true, cwd: '.', src: ['README.txt'], dest: 'build/app/' }
        ]
      },
      wgt: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/wgt/' },
          { expand: true, cwd: '.', src: ['config.xml'], dest: 'build/wgt/' },
          { expand: true, cwd: '.', src: ['icon.png'], dest: 'build/wgt/' }
        ]
      },
      crx: {
        files: [
          { expand: true, cwd: 'build/app/', src: ['**'], dest: 'build/crx/' },
          { expand: true, cwd: 'app/_locales', src: ['**'], dest: 'build/crx/_locales' },
          { expand: true, cwd: '.', src: ['manifest.json'], dest: 'build/crx/' },
          { expand: true, cwd: '.', src: ['icon.png'], dest: 'build/crx/' }
        ]
      }
    },

    htmlmin: {
      dist: {
        files: [
          { expand: true, cwd: '.', src: ['*.html'], dest: 'build/app/' }
        ],
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeCommentsFromCDATA: false,
          removeCDATASectionsFromCDATA: false,
          removeEmptyAttributes: true,
          removeEmptyElements: false
        }
      }
    },

    // replace stylesheet and js elements
    condense: {
      dist: {
        file: 'build/app/index.html',
        script: {
          src: 'lib/require.min.js',
          attrs: {
            'data-main': 'js/all'
          }
        },
        stylesheet: 'css/all.css'
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [
          { expand: true, cwd: '.', src: ['images/**'], dest: 'build/app/' }
        ]
      }
    },

    // make wgt package in build/ directory
    package: {
      wgt: {
        appName: '<%= packageInfo.name %>',
        version: '<%= packageInfo.version %>',
        files: 'build/wgt/**',
        stripPrefix: 'build/wgt/',
        outDir: 'build',
        suffix: '.wgt',
        addGitCommitId: false
      }
    },

    sdb: {
      prepare: {
        action: 'push',
        localFiles: './tools/grunt-tasks/tizen-app.sh',
        remoteDestDir: '/home/developer/',
        chmod: '+x',
        overwrite: true
      },

      pushwgt: {
        action: 'push',
        localFiles: {
          pattern: 'build/*.wgt',
          filter: 'latest'
        },
        remoteDestDir: '/home/developer/'
      },

      pushdumpscript: {
        action: 'push',
        localFiles: 'tools/dump-localStorage.sh',
        remoteDestDir: '/home/developer/',
        chmod: '+x',
        overwrite: true
      },

      dumplocalstorage: {
        action: 'script',
        remoteScript: '/home/developer/dump-localStorage.sh'
      },

      stop: {
        action: 'stop',
        remoteScript: '/home/developer/tizen-app.sh'
      },

      uninstall: {
        action: 'uninstall',
        remoteScript: '/home/developer/tizen-app.sh'
      },

      install: {
        action: 'install',
        remoteFiles: {
          pattern: '/home/developer/*.wgt',
          filter: 'latest'
        },
        remoteScript: '/home/developer/tizen-app.sh'
      },

      debug: {
        action: 'debug',
        remoteScript: '/home/developer/tizen-app.sh',
        localPort: '8888',
        openBrowser: 'google-chrome %URL%'
      },

      start: {
        action: 'start',
        remoteScript: '/home/developer/tizen-app.sh'
      }
    },

    inline: {
      script: 'build/save-perf-data.min.js',
      htmlFile: 'build/app/index.html'
    },

    simple_server: {
      port: 30303,
      dir: 'build/app/'
    }
  });

  grunt.registerTask('dist', [
    'clean',
    'copy:common',
    'imagemin:dist',
    'requirejs:dist',
    'uglify:dist',
    'concat:dist',
    'cssmin:dist',
    'htmlmin:dist',
    'condense'
  ]);

  grunt.registerTask('crx', ['dist', 'copy:crx']);
  grunt.registerTask('wgt', ['dist', 'copy:wgt', 'package:wgt']);
  grunt.registerTask('perf', [
    'dist',
    'uglify:perf',
    'inline',
    'copy:wgt',
    'package:wgt'
  ]);

  grunt.registerTask('install', [
    'sdb:prepare',
    'sdb:pushwgt',
    'sdb:install',
    'sdb:start'
  ]);

  grunt.registerTask('reinstall', [
    'sdb:prepare',
    'sdb:pushwgt',
    'sdb:stop',
    'sdb:uninstall',
    'sdb:install',
    'sdb:start'
  ]);

  grunt.registerTask('wait', function () {
    var done = this.async();
    setTimeout(function () {
      done();
    }, 10000);
  });

  grunt.registerTask('perf-test', function () {
    var tasks = ['sdb:pushdumpscript', 'perf', 'reinstall', 'sdb:stop'];

    for (var i = 0; i < 11; i++) {
      tasks.push('sdb:start', 'wait', 'sdb:stop');
    }

    tasks.push('sdb:dumplocalstorage')

    grunt.task.run(tasks);
  });

  grunt.registerTask('restart', ['sdb:stop', 'sdb:start']);

  grunt.registerTask('server', ['dist', 'simple_server']);

  grunt.registerTask('wgt-install', ['wgt', 'install']);
  grunt.registerTask('wgt-reinstall', ['wgt', 'reinstall']);

  grunt.registerTask('default', 'wgt');
};
