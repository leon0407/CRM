module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({
        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>' // this port must be same with the connect livereload port
                },
                // Watch whatever files you needed.
                files: [
                    'app/*.html',
                    'app/stylesheets/style.css',
                    'app/scripts/**/*.js',
                    'app/stylesheets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'app/stylesheets/less/*.less',
                    'app/views/**/*.html'
                ]
            },
            css: {
                files: 'app/stylesheets/less/*.less',
                tasks: ['less:development'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            }
        },
        less: {
            development: {
                files: {
                    'app/stylesheets/yxtoms.css': 'app/stylesheets/less/main.less'
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'app/stylesheets/yxtoms.min.css':
                        [
                            'app/stylesheets/style.css',
                            'app/stylesheets/yxtoms.css',
                            'app/bower_components/angular-loading-bar/build/loading-bar.min.css'
                        ]
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            main: {
                files: {
                    'app/scripts/src/app.min.js': ['app/scripts/app.js']
                }
            },
            pdf: {
                files: {
                    'app/scripts/src/pdf.min.js': ['app/scripts/plugins/pdf.js']
                }
            },
            pdfwork: {
                files: {
                    'app/scripts/src/yxtoms.min.worker.js': ['app/scripts/plugins/pdf.worker.js']
                }
            },
            common: {
                files: {
                    'app/scripts/src/common.min.js': ['app/scripts/common.js','app/scripts/connection.js','app/scripts/bridge.1.0.0.js']
                }
            },
            controller: {
                files: {
                    'app/scripts/src/controller.min.js': ['app/scripts/controllers/**/*.js']
                }
            },
            route: {
                files: {
                    'app/scripts/src/route.min.js': ['app/scripts/route/**/*.js']
                }
            },
            services: {
                files: {
                    'app/scripts/src/service.min.js': ['app/scripts/factory.js', 'app/scripts/services/**/*.js']
                }
            },
            directive: {
                files: {
                    'app/scripts/src/directive.min.js': ['app/scripts/directives/**/*.js']
                }
            },
            filter: {
                files: {
                    "app/scripts/src/filter.min.js": ['app/scripts/filter.js']
                }
            }
        },
        concat: {
            basic: {
                files: {
                    'app/scripts/src/yxtoms.min.js':
                        [
                            'app/bower_components/jquery/dist/jquery.min.js',
                            'app/bower_components/angular/angular.min.js',
                            'app/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                            'app/bower_components/angular-animate/angular-animate.min.js',
                            'app/bower_components/angular-loading-bar/build/loading-bar.min.js',
                            'app/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
                            'app/bower_components/angular-bindonce/bindonce.min.js',
                            //'app/scripts/src/pdf.min.js',

                            'app/scripts/src/app.min.js',
                            'app/scripts/src/common.min.js',
                            'app/scripts/src/controller.min.js',
                            'app/scripts/src/service.min.js',
                            'app/scripts/src/route.min.js',
                            'app/scripts/src/directive.min.js',
                            'app/scripts/src/filter.min.js'
                        ]
                }
            }
        },
        clean: {
            target: {
                src: [
                    'app/scripts/src/common.min.js',
                    'app/scripts/src/pdf.min.js',
                    'app/scripts/src/app.min.js',
                    'app/scripts/src/controller.min.js',
                    'app/scripts/src/service.min.js',
                    'app/scripts/src/route.min.js',
                    'app/scripts/src/directive.min.js',
                    'app/scripts/src/filter.min.js'
                ]
            }
        },
        connect: {
            options: {
                port: 8000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35728
            },
            livereload: {
                options: {
                    open: true,
                    base: 'app'
                }
            }
        }
    });
    grunt.registerTask('serve', ['connect:livereload', 'less', 'watch']);
    grunt.registerTask('default', ['cssmin', 'uglify', 'concat', 'clean']);
};
