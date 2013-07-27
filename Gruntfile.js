module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'lib/**/*.js'],
            options: require('./.jshintrc.js')
        },
        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: "src",
                    src: ['**'],
                    dest: 'dest',
                    filter: 'isFile'
                }]
            }
        },
        // connect: {
        //     server: {
        //       options: {
        //         port: 1234,
        //         base: '.'
        //       }
        //     }
        // },
        // mocha: {
        //     all: ['test/**/*.html'],
        //     options: {
        //         reporter: 'Spec',
        //         run: false,
        //         ignoreLeaks: false,
        //         timeout:5000
        //     }
        // }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    // grunt.loadNpmTasks("grunt-contrib-connect");
    // grunt.loadNpmTasks("grunt-mocha");
    // grunt.loadNpmTasks("grunt-contrib-uglify");

    // grunt.registerTask("test", ["connect", "mocha"]);
    grunt.registerTask("default", ["jshint" /*, "uglify" */]);
};