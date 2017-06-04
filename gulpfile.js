/*
MIT License

Copyright (c) 2017 Jorge Matricali

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var gulp = require('gulp')
var less = require('gulp-less')
var path = require('path')
var del = require('del')
var inject = require('gulp-inject-string')
var runSequence = require('run-sequence')

var pkg = require('./package.json')

gulp.task('less', function () {
  return gulp.src('./less/8bits-*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less')],
      compress: true
    }))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('postcss', function () {
  gulp.src('dist/css/*.css')
    .pipe(inject.prepend('/* 8bits theme v' + pkg.version + ' by @jorge-matricali, ' + pkg.repository.url + ' */\n'))
    .pipe(gulp.dest('dist/css/'))
})

gulp.task('clean', function () {
  return del([
    'dist/css/*.css'
  ])
})

gulp.task('build', function (callback) {
  console.log('Building...')
  runSequence('clean', 'less', 'postcss', callback)
})

gulp.task('default', ['build'])
