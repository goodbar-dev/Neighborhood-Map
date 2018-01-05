const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const server = browserSync.create();
const paths = {
  js: {
    src: 'src/js/*.js',
    dest: 'dist/js/'
  },
  css: {
    src: 'src/css/*.css',
    dest: 'dist/css/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  }
}

//Reloads the site.
gulp.task('Reload', function(done) {
  server.reload();
  done();
});

//Determines base directory where the index.html file is located.
gulp.task('Serve', function(done) {
  server.init({
    server: {
      baseDir: 'dist'
    }
  });
  done();
});

//Clean Dist folder
gulp.task('Clean', function() {
  gulp.src('dist', {read: false})
    .pipe(clean());
});

//Copy all HTML files
gulp.task('CopyHTML', function() {
  gulp.src(paths.html.src, { sourcemaps: true })
    .pipe(gulp.dest(paths.html.dest));
});

//Minify & Concat all CSS files
gulp.task('MinifyCSS', function() {
  gulp.src(paths.css.src, { sourcemaps: true })
    .pipe(concat('style.min.css'))
    //.pipe(cleanCSS())
    .pipe(gulp.dest(paths.css.dest));
});

//Minify & Concat the JS
gulp.task('MinifyJS', function() {
  gulp.src(paths.js.src, { sourcemaps: true })
    .pipe(concat('main.min.js'))
    //.pipe(uglify())  //does not support ES6 at this time.
    .pipe(gulp.dest(paths.js.dest));
});

//Watch for changes and reload browser
gulp.task('Watch', function() {
  gulp.watch(paths.js.src, ['MinifyJS', 'Reload']);
  gulp.watch(paths.css.src, ['MinifyCSS', 'Reload']);
  gulp.watch(paths.html.src, ['CopyHTML', 'Reload']);
});

//Sets the default command sequence when simply calling 'gulp' on the command line.
gulp.task('default', ['CopyHTML', 'MinifyCSS', 'MinifyJS', 'Serve', 'Watch']);
