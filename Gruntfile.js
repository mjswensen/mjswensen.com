module.exports = function(grunt) {
  grunt.initConfig({

    jekyll: {
      options: {
        config: '_config.yml'
      },
      serve: {
        options: {
          serve: true
        }
      },
      build: {}
    },

    sass: {
      options: {
        style: 'compressed'
      },
      site: {
        files: {
          'css/styles.css': '_styles/styles.sass'
        }
      },
      presentations: {
        files: {
          'presentations/javascript-and-jquery/css/styles.css': 'presentations/javascript-and-jquery/_styles/styles.sass'
        }
      }
    },

    watch: {
      site: {
        files: [
          '_includes/**',
          '_layouts/**',
          'about/**',
          'blog/**',
          'css/**',
          'presentations/**'
        ],
        tasks: 'jekyll:build'
      },
      siteStyles: {
        files: '_styles/*.sass',
        tasks: 'sass:site'
      },
      presentationStyles: {
        files: 'presentations/javascript-and-jquery/_styles/*sass',
        tasks: 'sass:presentations'
      }
    },

    concurrent: {
      dev: {
        tasks: ['jekyll:serve', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', 'concurrent');
};
