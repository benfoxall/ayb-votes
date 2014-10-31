// client -> client-dist

var gulp = require('gulp'),
    serve = require('gulp-serve'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    cssmin = require('gulp-cssmin'),
    inline = require('gulp-inline'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat');


var paths = {
  js:[
    'client/lib/*.js',
    'client/script.js'
  ],
  html: 'client/index.html',
  less: 'client/style.less'
}

gulp.task('serve', serve({
  root:'client-dist',
  port: 5000,
}));

gulp.task('html', function(){
  gulp.src('client/index.html')
      .pipe(gulp.dest('./client-dist/'))
})

gulp.task('scripts', function() {
  return gulp.src(paths.js)
    // .pipe(sourcemaps.init())
      .pipe(concat('all.js'))
      .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('./client-dist/'))
});

gulp.task('less', function(){
  return gulp.src(paths.less)
    // .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(cssmin())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('./client-dist/'));
})

gulp.task('watch', function(){
  gulp.watch(paths.js, ['scripts']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.less, ['less']);
})

gulp.task('default', ['serve', 'watch', 'html', 'scripts', 'less'])


// gulp.task('build',   ['max', 'scripts-max', 'less-max'])

gulp.task('build', ['scripts', 'less'], function(){
  gulp.src('client/index.html')
      .pipe(inline({
        base: 'client-dist/',
        js: uglify(),
        css: cssmin()
      }))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('./client-dist/'))
})

