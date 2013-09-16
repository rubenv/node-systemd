'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);

};
