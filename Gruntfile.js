/* global module */

// The idea is that first the LESS/HTML is compiled/processed
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
                    create: ['build', 'build/stylesheets', 'build/scripts', 'build/images']
                }
            }
        },

        // LESS
        recess: {
            all: {
                options: {
                    compile: true
                },
                files: [
                    // First copy everything from the images folder & then copy the crushed files over
                    {expand: true, cwd: 'src/less/', src: ['*', '!bootstrap-ie7.less', '!boxsizing.htc'], dest: 'src/stylesheets', filter: 'isFile', rename: function(dest, src){ return dest + '/' + src.replace('.less', '.css'); }},
                ]
            }
        },

        // Handle images
        smushit: {
            // This one has only one task, any image in images folder will be crushed and result is outputted to the images_crushed folder
            all: {
                expand: true,
                cwd: 'src/images',
                src: '*.{png,jpg,jpeg,gif}',
                dest: 'build/images'
            }
        },

        // Time to handle copying files
        copy: {
            scripts: {
                files: [
                    // Copy scripts
                    {expand: true, cwd: 'src/scripts/', src: ['**'], dest: 'build/scripts', filter: 'isFile'},
                ]
            },
            
            images: {
                files: [
                    // Copy scripts
                    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'build/images', filter: 'isFile'},
                ]
            },

            css: {
                files: [
                    // Copy CSS
                    {expand: true, cwd: 'src/stylesheets/', src: ['**'], dest: 'build/stylesheets', filter: 'isFile'},
                ]
            },

            extras: {
                files: [
                    // Copy EXTRAS
                    {expand: true, cwd: 'src/extras/', src: ['**, .htaccess'], dest: 'build/', filter: 'isFile'},
                ]
            }
        },

        // Some folders are not needed
        clean: {
            "all": ['build/stylesheets/smacss', 'project/stylesheets/bootstrap']
        },

        // Handle watching
        watch: {
            options: {
                livereload: true,
                files: ['build/**']
            },
            // Process
            imageminW: {
                files: ['src/images/**'],
                tasks: ['copy:images'],
            },
            lessW: {
                files: ['src/less/**'],
                tasks: ['recess:all', 'copy:css'],
            },

            // Copy
            scriptsW: {
                files: ['src/scripts/**'],
                tasks: ['copy:scripts'],
            },
            htmlW: {
                files: ['src/html/**'],
                tasks: ['stencil:html'],
            },
            extrasW: {
                files: ['src/extras/**'],
                tasks: ['copy:extras'],
            }
        },
        
        nodestatic: {
            server: {
                options: {
                    port: 1337,
                    dev: true,
                    base: 'build'
                }
            }
        },

        stencil: {
            html: {
                options: {
                    partials: 'src/html/partials/',
                    dot_template_settings: {
                        strip: false
                    }
                },
                files: [
                    {
                    expand: true,
                    src: 'src/html/*.html',
                    dest: 'build',
                    ext: '.html',
                    flatten: true
                    }
                ]
            }
        }

    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-smushit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-nodestatic');
    grunt.loadNpmTasks('grunt-stencil');

    // Set Tasks
    grunt.registerTask('default', []);
    grunt.registerTask('dev', ['nodestatic', 'watch']);
    grunt.registerTask('init', ['mkdir:init', 'recess:all', 'smushit:all', 'copy:css', 'copy:scripts', 'stencil:html', 'copy:extras', 'clean:all']);
};
