// vim: set ts=2 sw=2:

var path     =  require("path");
var matchdep =  require('matchdep');

module.exports = function(grunt) {

  matchdep.filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var pkg = grunt.file.readJSON('package.json');

  var ngmin = {
    name: 'ngmin',

    createConfig: function(context, block) {
      var cfg = {files:[]};
      context.outFiles = [];

      // Depending whether or not we're the last of the step we're not going to output the same thing:
      // if we're the last one we must use the block dest file name for output
      // otherwise uglify each input file into it's given outputfile
      if (context.last === true) {
        var files = {};
        var ofile = path.join(context.outDir, block.dest);
        files.dest = ofile;
        files.src = context.inFiles.map(function(fname) { return path.join(context.inDir, fname);});
        // cfg[ofile] = context.inFiles.map(function(fname) { return path.join(context.inDir, fname);});
        cfg.files.push(files);
        context.outFiles.push(block.dest);
      } else {
        context.inFiles.forEach(function(fname) {
          var file = path.join(context.inDir, fname);
          var outfile = path.join(context.outDir, fname);
          cfg.files.push({src: [file], dest: outfile});
          // cfg[outfile] = [file];
          context.outFiles.push(fname);
        });
      }

      return cfg;
    },
  };


  // Project configuration.
  grunt.initConfig({
    pkg: pkg,

    // JsHint
    jshint: {
        options: pkg.jshintConfig,
        all: [
            'Gruntfile.js',
            'app/scripts/**/*.js',
            'app/scripts/*.js',
            'test/**/*.js'
        ]
    },

    bower: {
      install: {
        options: { targetDir: "app/components" }
      }
    },

    useminPrepare: {
        html: 'app/index.html',
        options: {
            dest: 'dist/app',
            flow: { steps: { 'js': [ngmin, 'concat', 'uglifyjs'], 'css': ['concat', 'cssmin']}, post: {}},
            // flow: { steps: { 'js': ['concat', ngmin], 'css': ['concat', 'cssmin']}, post: {}},
        }
    },

    // Concat
    concat: {
        options: {
            separator: ';'
        },
        // dist configuration is provided by useminPrepare
        dist: {}
    },

    // Uglify
    uglify: {
        // dist configuration is provided by useminPrepare
        dist: {}
    },

    // Usemin
    // Replaces all assets with their revved version in html and css files.
    // options.assetDirs contains the directories for finding the assets
    // according to their relative paths
    usemin: {
        html: ['dist/app/*.html'],
        css: ['dist/app/styles/*.css'],
        options: {
            assetsDirs: ['dist/app', 'dist/app/styles', 'dist/app/scripts'],
        }
    },

    ngmin: {
      dist: { }
    },

    less: {
      dev: {
        src: 'app/styles/main.less',
        dest: 'app/styles/main.css'
      },
      release: {
        src: 'app/styles/main.less',
        dest: 'dist/app/styles/main.css',
        options: {
          compress: true
        }
      }
    },

    copy: {
        // copy:release copies all html and image files to dist
        // preserving the structure
        release: {
          files: [
            {
              expand: true,
              cwd: 'app',
              src: [
                'images/*.{png,gif,jpg,svg,jpeg}',
                'templates/*.html',
                'components/bootstrap/fonts/*',
                '*.html'
              ],
              dest: 'dist/app'
            },
          ]
        }
    },

    // Filerev
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 20
      },
      release: {
        // filerev:release hashes(md5) all assets (images, js and css )
        // in dist directory
        files: [{
          src: [
            'dist/app/images/*.{png,gif,jpg,svg}',
            'dist/app/scripts/*.js',
            'dist/app/styles/*.css',
          ]
        }]
      }
    },

    clean: {
      // clean:release removes generated files
      release: [
        'dist',
        'app/components',
        'app/styles/*.css'
      ]
    },

    // Watch
    watch: {
      // watch:less invokes less:dev when less files change
      less: { }
    },

  });

  // Invoked when grunt is called
  grunt.registerTask('default', 'Default task', [
    'jshint',
    'bower:install',
    'less:dev'
  ]);


  grunt.registerTask('release', 'Creates a release in /dist', [
      'clean',
      'bower:install',
      'jshint',
      'less:release',
      'useminPrepare',
      'ngmin',
      'concat',
      'uglify',
      'copy:release',
      'filerev',
      'usemin'
  ]);
};
