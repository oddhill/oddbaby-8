var gulp = require('gulp')
var sass = require('gulp-sass')
var eslint = require('gulp-eslint')
var scsslint = require('gulp-scss-lint')
var browserify = require('browserify')
var shim = require('browserify-shim')
var babelify = require('babelify')
var cssGlobbing = require('gulp-css-globbing')
var source = require('vinyl-source-stream')
var drupalBreakpoints = require('drupal-breakpoints-scss')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var buffer = require('vinyl-buffer')

// babel
gulp.task('browserify', function () {
  var b = browserify({
    basedir: './js',
    entries: './main.js'
  })

  b.transform(babelify, {presets: ['es2015']})
  b.transform(shim, {global: true})

  return b.bundle()
    .on('error', function (err) {
      console.log(err.message)
      this.emit('end')
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})

// Compile sass
gulp.task('sass', function () {
  // Generate _breakpoints.scss
  gulp.src('./*.breakpoints.yml')
    .pipe(drupalBreakpoints.ymlToScss())
    .pipe(rename('_breakpoints.scss'))
    .pipe(gulp.dest('./scss/utils'))

  return gulp.src(['./scss/main.scss', './scss/print.scss'])
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sass({
      includePaths: [
        'node_modules/bourbon/app/assets/stylesheets/',
        'node_modules/bourbon-neat/app/assets/stylesheets/',
        'node_modules/normalize.css/',
        'node_modules/Stratagem/'
      ]
    }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
})

// Lint sass
gulp.task('scss-lint', function () {
  return gulp.src(['./scss/**/*.scss', '!./scss/print.scss', '!scss/normalize.scss', '!scss/vendor/**/*'])
    .pipe(scsslint())
})

// Eslint
gulp.task('eslint', function () {
  return gulp.src('./js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
})

// Watch .scss and .js
gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', ['scss-lint', 'sass'])
  gulp.watch('js/**/*.js', ['eslint', 'browserify'])
})

// Set default task
gulp.task('default', ['watch'])
