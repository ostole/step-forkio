
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const jsmin = require('gulp-js-minify');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const cleanCss = require('gulp-clean-css');

const files = {
    scssPath: 'src/scss/*.scss',
    jsPath: 'src/js/*.js',
    imgPath: 'src/img/*'
}

function clear() {
    return gulp.src('./dist/*', {
        read: false
    })
        .pipe(clean());
}
exports.clear = clear;

function buildStyles() {
    let plugins = [
        autoprefixer({overrideBrowserslist: ['last 3 version']}),
        cssnano()
    ];
    return gulp.src(files.scssPath)
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/styles'));

}
exports.buildStyles = buildStyles;

function buildScripts() {
    return gulp.src(files.jsPath)
        .pipe(concat('min.js'))
        .pipe(uglify())
        .pipe(jsmin())
        .pipe(gulp.dest('dist/scripts'));
}
exports.buildScripts = buildScripts;

function buildImages() {
    return gulp.src(files.imgPath)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
}
exports.buildImages = buildImages;

function watchStyles() {
    gulp.watch(files.scssPath, buildStyles).on('change', browserSync.reload);
}
exports.watchStyles = watchStyles;

function watchScripts() {
    gulp.watch(files.jsPath, buildScripts).on('change', browserSync.reload);
}
exports.watchScripts = watchScripts;

function serve(cb) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    cb();
}
exports.serve = serve;

exports.build = gulp.series(
    clear,
    gulp.parallel(buildStyles, buildScripts, buildImages)
)

exports.dev = gulp.parallel(watchStyles, watchScripts, serve)