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

var fs = require('fs')
var gulp = require('gulp')
var less = require('gulp-less')
var path = require('path')
var del = require('del')
var inject = require('gulp-inject-string')
var sequence = require('run-sequence')
var exec = require('child_process').exec
var deploy = require('gulp-deploy-git')
var uglify = require('gulp-uglify')

var pkg = require('./package.json')

var git = {
  template: '%B\nBuilt from %H.',
  commit: undefined,
  login: process.env.GIT_LOGIN,
  token: process.env.GIT_TOKEN,
  repo: process.env.GIT_REPO
}

var dir = {
  dist: './dist'
}

gulp.task('less', function () {
  return gulp.src('./less/8bits-*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less')],
      compress: true
    }))
    .pipe(gulp.dest(dir.dist + '/themes'))
})

gulp.task('postcss', function () {
  gulp.src(dir.dist + '/themes/*.css')
    .pipe(inject.prepend('/* 8bits theme v' + pkg.version + ' by @jorge-matricali, ' + pkg.repository.url + ' */\n'))
    .pipe(gulp.dest(dir.dist + '/themes/'))
})

gulp.task('copy', function () {
  gulp.src('index.html')
    .pipe(gulp.dest(dir.dist))
})

gulp.task('customizer', function () {
  var themeVariants = fs.readdirSync(dir.dist + '/themes')
  var i = themeVariants.length
  while (i--) {
    if (themeVariants[i].indexOf('.css', themeVariants[i].length - (4)) !== -1) {
      themeVariants[i] = themeVariants[i].replace('8bits-', '').replace('.css', '')
    } else {
      themeVariants.splice(i, 1)
    }
  }
  return gulp.src('change-theme.js')
    .pipe(inject.replace(
      'var themeVariants = \\[\\]',
      `var themeVariants = ${JSON.stringify(themeVariants)}`
    ))
    // .pipe(uglify())
    .pipe(gulp.dest(dir.dist))
})

gulp.task('clean', function () {
  return del([
    dir.dist + '/themes/*.css',
    dir.dist + '/index.html',
    dir.dist + '/change-theme.js'
  ])
})

gulp.task('build', function (callback) {
  console.log('Building...')
  sequence('clean', ['copy', 'less'], ['customizer', 'postcss'], callback)
})

gulp.task('git:info', function (callback) {
  exec('git log --format=\'' + git.template + '\' -1', function (err, stdout, stderr) {
    git.commit = stdout
    return callback(err)
  })
})

gulp.task('deploy', ['git:info'], function (callback) {
  gulp.src(dir.dist + '/**/*', {read: false})
    .pipe(
      deploy({
        repository: `https://${git.login}:${git.token}@${git.repo}`,
        branches: ['HEAD'],
        remoteBranch: 'gh-pages',
        prefix: dir.dist,
        message: git.commit
      })
      .on('error', function (err) {
        callback(err)
      })
    )
})

gulp.task('default', ['build'])
