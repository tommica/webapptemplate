/* global module */
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    clean: {
      "del-release": ['release'],
      "release": ['release/css/smacss', 'release/css/bootstrap']
    },

    compass: {
      watch: {
        options: {
          config: 'config.rb',
          outputStyle: 'expanded',
          force: true,
          debugInfo: true
        }
      },

      release: {
        options: {
          config: 'config.rb',
          outputStyle: 'compact',
          force: true,
          noLineComments: true
        }
      }
    },

    copy: {
      release: {
        files: [
          {expand: true, cwd: './', src: ['*.png', '*.html', '*.xml', '*.ico', '*.txt', '.htaccess'], dest: 'release/', filter: 'isFile'}, // Root files
          {expand: true, cwd: './', src: ['images/**'], dest: 'release/', filter: 'isFile'}, // Images
          {expand: true, cwd: './', src: ['scripts/**'], dest: 'release/', filter: 'isFile'}, // Scripts
          {expand: true, cwd: './', src: ['css/**'], dest: 'release/', filter: 'isFile'}, // CSS
        ]
      }
    },

    imagemin: {
      release: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'images',
          src: '*.{png,jpg,jpeg}',
          dest: 'release/images'
        }]
      }
    },
    
    ender: {
      options: {
        output: "scripts/vendor/ender",
        dependencies: ["jeesh"]
      }
    },
    
    mkdir: {
      release: {
        options: {
          create: ['release']
        }
      }
    },

    watch: {
      css: {
        files: ['sass/**'],
        tasks: ['compass:watch'],
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ender');
  grunt.loadNpmTasks('grunt-mkdir');

  // Set Tasks
  grunt.registerTask('default', []);
  grunt.registerTask('init', ['ender', 'compass:watch']);
  grunt.registerTask('wc', ['watch:css']);
  grunt.registerTask('release', ['ender', 'mkdir:release', 'clean:del-release', 'compass:release', 'copy:release', 'clean:release', 'imagemin:release', 'compass:watch']); // Compass watch in the end is there just to restore the dev version of the css
};
