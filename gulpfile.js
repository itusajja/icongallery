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


/*
  Determine domain
  var domain used to determine which site to build
*/
var domain = '';
if(argv.ios !== undefined) {
  domain = 'ios';
} else if(argv.applewatch !== undefined) {
  domain = 'applewatch';
} else if(argv.mac !== undefined) {
  domain = 'mac'
} else {
  console.log('Incorrect flag. {--ios | --applewatch | --mac}')
  process.exit(1);
}

/*
  Jekyll Build & Rebuild
  Run a command in a shell
  https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support
*/
gulp.task('jekyll-build', function(cb) {
  exec('jekyll build --config _config.yml,' + domain + 'icongallery/_config.yml', function(err) {
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
  return gulp.src('assets/styles/styles.scss')
    .pipe(sass({
      includePaths: ['assets/styles/_sass'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 5 versions', '> 1%', 'ie 8'], { cascade: true }))
    .pipe(gulp.dest('_site/assets/styles'))
    .pipe(browserSync.stream());
});

/*
  Scripts
  Bundle everything with browserify. Transpile with babelify
  http://www.jayway.com/2015/03/04/using-react-with-ecmascript-6/
  https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-transforms.md
*/
gulp.task('scripts', function (cb) {
  var b = browserify({
    entries: 'assets/scripts/entry.jsx',
    extensions: ['.jsx'],
    debug: true,
    transform: ['babelify']
  });
  return b.bundle()
    .pipe(source('entry.js'))
    .pipe(gulp.dest('_site/assets/scripts'))
    .pipe(browserSync.stream());
});

gulp.task('scripts:prod', function(){
  return gulp.src('_site/assets/scripts/*.js')
    .pipe(uglify())
    //.pipe(gzip({ append: false }))
    .pipe(gulp.dest('_site/assets/scripts'));
});

gulp.task('data:prod', function(){
  return gulp.src('_site/data.json')
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('_site/'));
});

/*
  Watch 
*/
gulp.task('watch', function () {
  browserSync.init({
    server: "./_site"
  });
  gulp.watch('assets/styles/**/*.scss', ['styles']);
  gulp.watch('assets/scripts/**/*', ['scripts']);
  gulp.watch([
    '*.html',
    '*.xml',
    '*.json',
    '_layouts/*.html',
    '_includes/*.html', 
    '*icongallery/**/*',
    'search/*',
    'feed/*'
  ], ['jekyll-rebuild']);
});

/*
  Default & Prod Tasks
*/
gulp.task('dev', function(cb){
  runSequence(
    'jekyll-build',
    ['styles', 'scripts'],
    'watch'
  );
});
gulp.task('prod', function(cb){
  runSequence(
    'jekyll-build',
    ['styles', 'scripts'],
    'scripts:prod'
    //'data:prod'
    // uglify the js
  );
});