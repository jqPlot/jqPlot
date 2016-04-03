module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: pkg,
    clean: {
      build: {
        src: [ 'build' ]
      },
      dist: {
        src: [ 'dist', '*.zip' ]
      },
      examples: {
        src: [ 'build/examples/*.php', 'build/examples/*.inc', 'build/examples/closer.html', 'build/examples/commonScripts.html', 'build/examples/topbanner.html' ]
      }
    },
    revision: {
      options: {
        property: 'pkg.revision',
        ref: 'HEAD',
        short: true
      }
    },
    copy: {
      build: {
        cwd: 'src',
        src: [ '**' ],
        dest: 'build',
        expand: true,
        options: {
          process: function (content, srcpath) {
            content = content.replace(/@VERSION/g, pkg.version);
            content = content.replace(/@REVISION/g, pkg.revision);

            var ext = srcpath.substring(srcpath.lastIndexOf('.')+1);
            var dirs = srcpath.split('/');
            if (ext === 'js' && dirs.length === 2) {
              if (srcpath != "src\/jquery.js" && srcpath != "src\/jquery.min.js" && srcpath != "src\/excanvas.js" && srcpath !== 'src\/jqplot.core.js') {
                content = content.replace(/[\s\S]*?\(function\(\$\) \{/, "");
              }
              if (srcpath != "src\/jquery.js" && srcpath != "src\/jquery.min.js" && srcpath != "src\/excanvas.js" && srcpath !== 'src\/jqplot.effects.blind.js') {
                content = content.replace(/\}\)\(jQuery\)\;(?!.*\}\)\(jQuery\)\;)/g, "");
              }
            }
            return content;
          }
        }
      },
      build_examples: {
        cwd: 'examples',
        src: [ '**' ],
        dest: 'build/examples',
        expand: true
      },
      dist: {
        files: [
          {cwd: 'build', src: ['jquery.jqplot.js'], dest: 'dist', expand: true},
          {cwd: 'build', src: ['jquery.jqplot.min.js'], dest: 'dist', expand: true},
          {cwd: 'build', src: ['jquery.jqplot.css'], dest: 'dist', expand: true},
          {cwd: 'build', src: ['jquery.jqplot.min.css'], dest: 'dist', expand: true},
          {cwd: 'build', src: ['excanvas.js'], dest: 'dist', expand: true},
          {cwd: 'build', src: ['version.txt'], dest: 'dist', expand: true},
          {cwd: 'build', src: ['plugins/*'], dest: 'dist', expand: true},
          {src: ['README.md'], dest: 'dist', expand: true},
          {src: ['copyright.txt'], dest: 'dist', expand: true},
          {cwd: 'src', src: ['*.txt'], dest: 'dist', expand: true},
          {cwd: 'src', src: ['jquery.js'], dest: 'dist', expand: true},
          {cwd: 'src', src: ['jquery.min.js'], dest: 'dist', expand: true}
        ],
      },
      dist_examples: {
        cwd: 'build',
        src: ['examples/**'],
        dest: 'dist',
        expand: true,
        options: {
          noProcess: ['**/*.{png,gif,jpg,ico,psd}'],
          process: function (content, srcpath) {
            var ext = srcpath.substring(srcpath.lastIndexOf('.')+1);
            if (ext === 'html') {
              content = content.replace(/src="..\/src\//g, 'src="..\/');
              content = content.replace(/href="..\/src\//g, 'href="..\/');
              content = content.replace(/src="\.\/src\//g, 'src="\.\.\/');
              content = content.replace(/\.php/g, '.html');
              content = content.replace(/jqplot.(\w+).js/g, 'jqplot.$1.min.js');
              content = content.replace("jquery.jqplot.js", 'jquery.jqplot.min.js');
              content = content.replace("jquery.jqplot.css", 'jquery.jqplot.min.css');
              content = content.replace("example.js", 'example.min.js');
              content = content.replace("examples.css", 'examples.min.css');
            }
            return content;
          }
        },
      },
      dist_docs: {
        cwd: 'extras/docs',
        src: [ '**' ],
        dest: 'dist/docs',
        expand: true
      }
    },
    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: [
          'build/jqplot.core.js',
          'build/jqplot.axisLabelRenderer.js',
          'build/jqplot.axisTickRenderer.js',
          'build/jqplot.canvasGridRenderer.js',
          'build/jqplot.divTitleRenderer.js',
          'build/jqplot.linePattern.js',
          'build/jqplot.lineRenderer.js',
          'build/jqplot.linearAxisRenderer.js',
          'build/jqplot.linearTickGenerator.js',
          'build/jqplot.markerRenderer.js',
          'build/jqplot.shadowRenderer.js',
          'build/jqplot.shapeRenderer.js',
          'build/jqplot.tableLegendRenderer.js',
          'build/jqplot.themeEngine.js',
          'build/jqplot.toImage.js',
          'build/jsdate.js',
          'build/jqplot.sprintf.js',
          'build/jqplot.effects.core.js',
          'build/jqplot.effects.blind.js'
        ],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.name %> <%= pkg.version %> | (c) 2009-<%= grunt.template.today("yyyy") %> Chris Leonello | jqplot.com\n   jsDate | (c) 2010-<%= grunt.template.today("yyyy") %> Chris Leonello\n */\n'
      },
      dist: {
        files: {
          'dist/jquery.<%= pkg.name %>.min.js': ['dist/jquery.<%= pkg.name %>.js'],
          'dist/examples/example.min.js': ['dist/examples/example.js']
        }
      },
      plugins: {
        files: grunt.file.expandMapping(['dist/plugins/*.js', '!dist/plugins/*.min.js'], '', {
          rename: function(destBase, destPath) {
            return destBase + destPath.replace(/\.js$/g, '.min.js');
          }
        })
      }
    },
    cssmin: {
      dist: {
        files: {
          "dist/jquery.jqplot.min.css": ["dist/jquery.jqplot.css"],
          "dist/examples/examples.min.css": ["dist/examples/examples.css"]
        }
      }
    },
    compress: {
      main: {
        options: {
          archive: 'jquery.jqplot.<%= pkg.version %>.<%= pkg.revision %>.zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: [
            'excanvas*.js',
            'jquery.js',
            'jquery.min.js',
            'jquery.jqplot.*',
            '*.txt',
            'docs/*',
            'examples/*',
            'images/*',
            'plugins/*',
          ],
          dest: '/'
        }]
      }
    },
    natural_docs: {
      options: {
        bin: 'extras\\NaturalDocs\\NaturalDocs.bat',
        xbin: 'extras/NaturalDocs/NaturalDocs.bat'
      },
      dist: {
        options: {
          src: 'build',
          project: 'NDdata/',
          inputs: ['/'],
          excludes: ['/jquery.js', '/jquery.jqplot.js', '/docs'],
          styles: ['Default', 'docstyles'],
          output: 'dist/docs/'
        }
      },
    },
    jslint: {
      dist: {
        src: [
          'src/*.js'
        ],
        exclude: [
          'src/jquery.min.js',
          'src/jquery.js'
        ],
        options: {
          edition: 'latest',
          errorsOnly: true,
          failOnError: false
        }
      }
    },
    convert_examples: {
      convert: {
        options: {
          cwd: 'build/examples'
        },
        files: [{
          expand: true,
          cwd: 'build/examples',
          src: ['*.php', '!opener.php', '!bodyOpener.php', '!openerNoHeader.php', '!bodyOpenerNoHeader.php', '!nav.php'],
          dest: 'build/examples',
          ext: '.html'
        }]
      }
    }
  });

  grunt.registerMultiTask('convert_examples', 'Convert example PHP files to HTML format', function() {

    var done = this.async();

    var options = this.options({
      cwd: ''
    });

    var files = this.files.slice();

    function process() {

      if (files.length <= 0) {
        done();
        return;
      }

      var file = files.pop();

      var child = grunt.util.spawn({
        cmd: 'php',
        args: [file.src[0].substring(file.src[0].lastIndexOf('/')+1)],
        opts: {
          cwd: options.cwd
        }
      }, function(error, result, code) {
        if (error === null) {
          grunt.file.write(file.dest, result);
        }
      });

      child.on('exit', function() {
        process();
      });

    }

    process();
        
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-git-revision');
  grunt.loadNpmTasks('grunt-natural-docs');

  grunt.registerTask('default', ['clean', 'revision', 'copy:build', 'copy:build_examples', 'convert_examples', 'clean:examples', 'copy:dist', 'copy:dist_examples', 'concat', 'uglify', 'cssmin', 'copy:dist_docs', 'natural_docs', 'compress']);
  grunt.registerTask('build', ['clean', 'revision', 'copy:build', 'copy:build_examples', 'convert_examples', 'clean:examples']);

};
