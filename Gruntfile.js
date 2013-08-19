/* global module */

// The idea is that first the SASS/COFFEESCRIPT/JADE is compiled/processed
// And then the result is stored in the right folder, where it is copied and manipulated more if needed to
// the proper folder in project
//
// Tasks
// Init - Initialize folder structure, process and copy files
// Watch - Watches the files, does needed actions and copies the files

module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Init task
        mkdir: {
            init: {
                options: {
                    create: ['project', 'project/stylesheets', 'project/scripts', 'project/images']
                }
            }
        },

        // SASS/CSS
        compass: {
            all: {
                options: {
                    config: 'config.rb',
                    outputStyle: 'expanded',
                    force: true,
                }
            }
        },

        // Handle images
        imagemin: {
            // This one has only one task, any image in images folder will be crushed and result is outputted to the images_crushed folder
            all: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: 'images',
                    src: '*.{png,jpg,jpeg}',
                    dest: 'images_crushed'
                }]
            }
        },

        // Handling coffeescript
        coffee: {
            // Just one task to handle anything related to coffeescripts
            all: {
                expand: true,
                flatten: true,
                cwd: 'coffee',
                src: ['**/*.coffee'],
                dest: 'scripts',
                ext: '.js'
            }
        },

        // Time to handle copying files
        copy: {
            images: {
                files: [
                    // First copy everything from the images folder & then copy the crushed files over
                    {expand: true, cwd: './images/', src: ['**'], dest: 'project/images', filter: 'isFile'},
                    {expand: true, cwd: './images_crushed/', src: ['**'], dest: 'project/images', filter: 'isFile'},
                ]
            },

            scripts: {
                files: [
                    // Copy scripts
                    {expand: true, cwd: './scripts/', src: ['**'], dest: 'project/scripts', filter: 'isFile'},
                ]
            },

            css: {
                files: [
                    // Copy CSS
                    {expand: true, cwd: './stylesheets/', src: ['**'], dest: 'project/stylesheets', filter: 'isFile'},
                ]
            },

            html: {
                files: [
                    // Copy HTML
                    {expand: true, cwd: './html/', src: ['**'], dest: 'project/', filter: 'isFile'},
                ]
            },

            extras: {
                files: [
                    // Copy EXTRAS
                    {expand: true, cwd: './extras/', src: ['**'], dest: 'project/', filter: 'isFile'},
                ]
            }
        },

        // Some folders are not needed
        clean: {
            "all": ['project/stylesheets/smacss', 'project/stylesheets/bootstrap']
        },

        // Handle watching
        watch: {
            // Process
            sassW: {
                files: ['sass/**'],
                tasks: ['compass:all'],
            },
            coffeeW: {
                files: ['coffee/**'],
                tasks: ['coffee:all'],
            },
            imageminW: {
                files: ['images/**'],
                tasks: ['imagemin:all', 'copy:images'],
            },

            // Copy
            cssW: {
                files: ['scripts/**'],
                tasks: ['copy:css', 'clean:all'],
            },
            scriptsW: {
                files: ['scripts/**'],
                tasks: ['copy:scripts'],
            },
            htmlW: {
                files: ['html/**'],
                tasks: ['copy:html'],
            },
            extrasW: {
                files: ['extras/**'],
                tasks: ['copy:extras'],
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Set Tasks
    grunt.registerTask('default', []);
    grunt.registerTask('init', ['mkdir:init']);
};
