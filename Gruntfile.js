// vim: set ts=2 sw=2:

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
        html: 'app/index.html',
        options: {
            dest: 'dist/app'
        }
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

  });

  grunt.registerTask('default', ['usemin']);
}
