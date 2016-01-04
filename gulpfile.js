const gulp = require('gulp');
const sass = require('gulp-sass');
const eslint = require('gulp-eslint');
const scsslint = require('gulp-scss-lint');
const browserify = require('browserify');
const shim = require('browserify-shim');
const babelify = require('babelify');
const cssGlobbing = require('gulp-css-globbing');
const source = require('vinyl-source-stream');
const drupalBreakpoints = require('drupal-breakpoints-scss');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');

// babel
gulp.task('browserify', function () {
  const b = browserify({
    basedir: './js',
    entries: './main.js'
  });

  b.transform(babelify, {presets: ['es2015']});
  b.transform(shim, { global: true });

  return b.bundle()
    .on('error', function (err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

// Compile sass
gulp.task('sass', function () {
  // Generate _breakpoints.scss
  gulp.src('./*.breakpoints.yml')
    .pipe(drupalBreakpoints.ymlToScss())
    .pipe(rename('_breakpoints.scss'))
    .pipe(gulp.dest('./scss/utils'));

  return gulp.src(['./scss/main.scss', './scss/print.scss'])
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sass({
      includePaths: [
        'node_modules/bourbon/app/assets/stylesheets/',
        'node_modules/bourbon-neat/app/assets/stylesheets/',
        'node_modules/Stratagem/'
      ]
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

// Lint sass
gulp.task('scss-lint', function () {
  return gulp.src(['./scss/**/*.scss', '!./scss/print.scss', '!scss/normalize.scss', '!scss/vendor/**/*'])
    .pipe(scsslint());
});

// Eslint
gulp.task('eslint', function () {
  return gulp.src('./js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

// Watch .scss and .js
gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', ['scss-lint', 'sass']);
  gulp.watch('js/**/*.js', ['eslint', 'browserify']);
});

// Set default task
gulp.task('default', ['watch']);
