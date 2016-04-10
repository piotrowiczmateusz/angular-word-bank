/* -------------------------------
   General
---------------------------------- */

/* Include Gulp */

var gulp = require('gulp');

/* Include Plugins */

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var filesize = require('gulp-filesize');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var minifyCss = require('gulp-minify-css');


/* Installation command:
    npm install gulp-clean gulp-concat gulp-filesize gulp-jshint gulp-rename gulp-sass gulp-uglify gulp-watch gulp-minify-css gulp-jade gulp-image-optimization
*/


/* Clean */

gulp.task('clean', function () {
  return gulp.src('build', {read: false})
    .pipe(clean());
});


/* -------------------------------
   Preprocessors plugins
---------------------------------- */


/* SASS */

gulp.task('sass', function() {
    return gulp.src('public/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'));
});


/* -------------------------------
   Optimalization plugins
---------------------------------- */


/* Concatenate & Minify Javascript */

gulp.task('scripts', function() {
    return gulp.src('public/js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(filesize())
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(filesize());
});

/* Minify CSS */

gulp.task('minify-css', function() {
  return gulp.src('public/css/*.css')
  	.pipe(concat('main.css'))
    .pipe(gulp.dest('public/css'))
    .pipe(filesize())
    .pipe(rename('main.min.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('public/css'))
    .pipe(filesize());
});


/* -------------------------------
   Other plugins
---------------------------------- */


/* Javascript debugger */

gulp.task('jshint', function() {
    return gulp.src('public/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/* Watch files for changes */

gulp.task('watch', function() {
    gulp.watch('public/js/*.js', ['jshint']);
    gulp.watch('public/scss/*.scss', ['sass']);
});

/* Default tasks */

gulp.task('default', ['clean', 'jshint', 'sass', 'watch', 'minify-css']);
