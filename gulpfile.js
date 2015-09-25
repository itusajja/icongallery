/*
  Dependencies
*/
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var uglify      = require('gulp-uglify');
var runSequence = require('run-sequence');
var argv        = require('yargs').argv;
var exec        = require('child_process').exec;
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var gzip        = require('gulp-gzip');
var path        = require('path');

/*
  Paths
*/
var files = {
  base: 'public',
  src: 'public/src',
  dist: 'public/dist',
  scripts: {
    src: 'public/src/assets/scripts',
    dist: 'public/dist/assets/scripts'
  },
  styles: {
    src: 'public/src/assets/styles',
    dist: 'public/dist/assets/styles'
  }
}
/*
  Determine domain
  var domain used to determine which site to build
  check for it only when you run jekyll build
*/
var domain = '';
function determineDomain(){
  // Check to see if any args were passed in and set domain accordingly
  if(argv.ios !== undefined) {
    domain = 'ios';
  }
  else if(argv.applewatch !== undefined) {
    domain = 'applewatch';
  }
  else if(argv.mac !== undefined) {
    domain = 'mac'
  }

  // If no arguments, exit process
  if(domain === '') {
    console.log('Gotta flag it and flag it right. {--ios | --applewatch | --mac}')
    process.exit(1);
  }
}

/*
  Jekyll Build & Rebuild
  Run a command in a shell
  https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
*/
gulp.task('jekyll-build', function(cb) {
  determineDomain();
  var configTheme = path.join(files.base, '_config.yml');
  var configSite = path.join(files.src, domain + 'icongallery', '_config.yml')
  exec('jekyll build --config ' + configTheme + ',' + configSite, function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});

gulp.task('jekyll-rebuild', function () {
  runSequence(
    'jekyll-build',
    ['styles', 'scripts']
  );
  browserSync.reload();
});

/*
  Styles
*/
gulp.task('styles', function () {
  return gulp.src(path.join(files.styles.src, 'styles.scss'))
    .pipe(sass({
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 5 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(gulp.dest( path.join(files.styles.dist) ))
    .pipe(browserSync.stream());
});
gulp.task('styles:prod', function () {
  return gulp.src(path.join(files.styles.src, 'styles.scss'))
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(prefix(['last 5 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(gulp.dest( path.join(files.styles.dist) ));
});

/*
  Scripts
  Bundle everything with browserify. Transpile with babelify
  http://www.jayway.com/2015/03/04/using-react-with-ecmascript-6/
  https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-transforms.md
*/
gulp.task('scripts', function (cb) {
  var b = browserify({
    entries: path.join(files.scripts.src, 'entry.jsx'),
    extensions: ['.jsx'],
    debug: true,
    transform: ['babelify']
  });
  return b.bundle()
    .pipe(source('entry.js'))
    .pipe(gulp.dest(files.scripts.dist))
    .pipe(browserSync.stream());
});

gulp.task('scripts:prod', function(){
  return gulp.src(path.join(files.scripts.dist, '*.js'))
    .pipe(uglify())
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest(path.join(files.scripts.dist)));
});

gulp.task('data:prod', function(){
  return gulp.src(path.join(files.dist, 'data.json'))
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest(files.dist));
});

/*
  Watch
*/
gulp.task('watch', function () {
  browserSync.init({
    server: "./public/dist"
  });
  gulp.watch(path.join(files.styles.src, '**/*.scss'), ['styles']);
  gulp.watch(path.join(files.scripts.src, '**/*'), ['scripts']);
  gulp.watch([
    path.join(files.src, '*.html'),
    path.join(files.src, '*.xml'),
    path.join(files.src, '*.json'),
    path.join(files.src, '_layouts/*.html'),
    path.join(files.src, '_includes/*.html'),
    path.join(files.src, '*icongallery/**/*'),
    path.join(files.src, 'search/*'),
    path.join(files.src, 'feed/*')
  ], ['jekyll-rebuild']);
});

/*
  Default & Prod Tasks
  Default task is for developing
  Prod tasks does same as develop except:
    - Doesn't launch the 'watch' task
    - Minifies, uglifies, and gzips scripts
  Prod task is usually launched from a shell scrip that also uploads everything
*/
gulp.task('default', function(cb){
  runSequence(
    'jekyll-build',
    ['styles', 'scripts'],
    'watch'
  );
});
gulp.task('prod', function(cb){
  runSequence(
    'jekyll-build',
    'scripts',
    ['styles:prod', 'scripts:prod', 'data:prod']
    // uglify the js
  );
});
