import autoprefixer from 'gulp-autoprefixer'
import babelify from 'babelify'
import browserify from 'browserify'
import concat from 'gulp-concat'
import gulp from 'gulp'
import rework from 'gulp-rework'
import util from 'gulp-util'
import notifier from 'node-notifier'
import watchify from 'watchify'
import source from 'vinyl-source-stream'

gulp.task('copyImages', function () {

  return gulp
    .src('src/images/*')
    .pipe(gulp.dest('dist/images/'))

})

gulp.task('copyIndex', function () {

  return gulp
    .src('src/index.html')
    .pipe(gulp.dest('dist/'))

})

gulp.task('css', function () {

  return gulp
    .src([
      'src/css/*',
      '!src/css/_*.css'
    ])
    .on('error', reworkError)
    .pipe(rework(
      require('rework-npm')(),
      require('rework-import')()
    ))
    .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('dist/'))

})

var bundler = browserify({
  cache: {},
  entries: ['./src/js/index.js'],
  // exclude: ['jquery'],
  packageCache: {},
  plugins: [watchify]
})
.transform(babelify.configure({ presets: ['es2015', 'react'] }))
.on('update', bundle)
gulp.task('js', bundle)

function bundle () {
  return bundler
    .bundle()
    .on('error', browserifyError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/'))
}

gulp.task('default', ['css', 'js', 'copyImages', 'copyIndex'])

gulp.task('watch', function () {

  gulp.watch('src/css/*.css', ['css'])
  gulp.watch('src/js/*.jsx', ['js'])
  gulp.watch('src/images/*', ['copyImages'])
  gulp.watch('src/index.html', ['copyIndex'])

})

function error (err, prefix) {
  notifier.notify({
    message: 'Error: ' + err.message,
    title: prefix || 'Error'
  })
  util.log(util.colors.red.bold(prefix || 'Error'), err.message, err.codeFrame)
  this.emit('end')
}

function browserifyError (err) {
  error.call(this, err, 'Browserify error')
}

function reworkError (err) {
  error.call(this, err, 'Rework error')
}