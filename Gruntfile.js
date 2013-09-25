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
                    create: ['project', 'project/stylesheets', 'project/scripts', 'project/images']
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
                    {expand: true, cwd: './less/', src: ['*', '!bootstrap-ie7.less', '!boxsizing.htc'], dest: './stylesheets', filter: 'isFile', rename: function(dest, src){ return dest + '/' + src.replace('.less', '.css'); }},
                ]
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
                // Copy HTML
                options: {
                    processContentExclude: 'html/404.html',
                    // Footer and Header added
                    processContent: function(content) {
                        var htmlHeader = grunt.file.read('html/partials/header.html');
                        var htmlFooter = grunt.file.read('html/partials/footer.html');
                        var ret = htmlHeader + content + htmlFooter;
                        return ret;
                    }
                },
                files: [
                    {expand: true, cwd: './html/', src: ['*'], dest: 'project/', filter: 'isFile'},
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
            options: {
                livereload: true,
                files: ['project/**']
            },
            // Process
            imageminW: {
                files: ['images/**'],
                tasks: ['imagemin:all', 'copy:images'],
            },
            lessW: {
                files: ['less/**'],
                tasks: ['recess:all', 'copy:css'],
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
        },
        
        nodestatic: {
            server: {
                options: {
                    port: 1337,
                    dev: true,
                    base: 'project'
                }
            }
        }

    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-nodestatic');

    // Set Tasks
    grunt.registerTask('default', []);
    grunt.registerTask('dev', ['nodestatic', 'watch']);
    grunt.registerTask('init', ['mkdir:init', 'recess:all', 'imagemin:all', 'copy:images', 'copy:css', 'copy:scripts', 'copy:html', 'copy:extras', 'clean:all']);
};
