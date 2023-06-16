
	const gulp = require('gulp');
	const browserSync = require('browser-sync').create();
	const sass = require('gulp-sass')(require('sass'));
	const clean = require('gulp-clean');
	const uglify = require('gulp-uglify');
	const autoprefixer = require('autoprefixer');
	const cssnano = require('cssnano');
	const postcss = require('gulp-postcss');
	const concat = require('gulp-concat');
	const cleanCSS = require('gulp-clean-css');
	const imagemin = require('gulp-imagemin');


	//Шляхи до файлів з якими ми працюватимемо (девелопмент файли)
	const files = {
		scssPath: 'src/scss/**/*.scss',
		jsPath: 'src/js/**/*.js',
		imgPatch: 'src/img/**/*'
	}

	function clear() {
		return gulp.src('./dist/*', {
			read: false
		})
			.pipe(clean());
	}

	exports.clear = clear;


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
			.pipe(sass())
			.pipe(cleanCSS())
			.pipe(postcss(plugins))
			.pipe(concat('styles.min.css'))
			.pipe(gulp.dest('dist/css'));
	}

	exports.buildStyles = buildStyles;

	//JS tasks - обєднання js файлів та мініфікація
	function buildScripts() {
		return gulp.src(files.jsPath)
			.pipe(concat('scripts.min.js'))
			.pipe(uglify())
			// .pipe(minify())
			.pipe(gulp.dest('dist/js'));
	}

	exports.buildScripts = buildScripts;


	//watch task
	function watchStyles() {
		gulp.watch(files.scssPath, buildStyles).on('change', browserSync.reload);
	};

	exports.watchStyles = watchStyles;

	function watchScripts() {
		gulp.watch(files.jsPath, buildScripts).on('change', browserSync.reload);
	}

	exports.watchScripts = watchScripts;

	//watch task
	function watchTask() {
		gulp.watch([files.scssPath, files.jsPath], gulp.parallel(scssTask, jsTask))
	}

	exports.watchTask = watchTask;

	function serve(cb) {
		browserSync.init({
			server: {
				baseDir: "./"
			}
		});
		cb();
	}

	exports.serve = serve;

	exports.dev = gulp.parallel(watchStyles, watchScripts, imageOptimizer, serve);

	//Deafult task
	exports.default = gulp.series(
		clear,
		gulp.parallel(buildStyles, buildScripts, imageOptimizer)
	);

