const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const jsminify = require('gulp-js-minify');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const cleanCss = require('gulp-clean-css');


//Шляхи до файлів з якими ми працюватимемо (девелопмент файли)
const files = {
    htmlPath: 'src/index.html',
    scssPath: 'src/scss/*.scss',
    jsPath: 'src/js/*.js',
    imgPath: 'src/img/*'
}

function clear() {
    return gulp.src('./dist/*', {read: false, allowEmpty: true})
        .pipe(clean());
}

exports.clear = clear;


function  buildHtml() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
}

exports.buildHtml = buildHtml;

function imageOptimizer() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
}

exports.imageOptimizer = imageOptimizer;


function buildStyles() {
    let plugins = [
        autoprefixer({overrideBrowserslist: ['last 1 version']}),
        cssnano()
    ];
    return gulp.src(files.scssPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(concat('main.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/css'));
}

exports.buildStyles = buildStyles;

//JS tasks - обєднання js файлів та мініфікація
function buildScripts() {
    return gulp.src(files.jsPath)
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(jsminify())
        .pipe(gulp.dest('dist/js'));
}

exports.buildScripts = buildScripts;

//watch task

function watchHtml() {
    gulp.watch(files.htmlPath, buildHtml).on('change', browserSync.reload);
}

exports.watchStyles = watchStyles;


function watchStyles() {
    gulp.watch(files.scssPath, buildStyles).on('change', browserSync.reload);
}

exports.watchStyles = watchStyles;

function watchScripts() {
    gulp.watch(files.jsPath, buildScripts).on('change', browserSync.reload);
}

exports.watchScripts = watchScripts;

function serve() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    watchHtml();
    watchStyles();
    watchScripts();
}

exports.serve = serve;

exports.dev = gulp.parallel(watchHtml, watchStyles, watchScripts, serve);

//Default task
exports.default = gulp.series(
    clear,
    gulp.parallel(buildHtml, buildStyles, buildScripts, imageOptimizer)
);

