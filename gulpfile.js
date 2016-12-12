var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlReplace = require('gulp-html-replace');
var htmlMin = require('gulp-htmlmin');

gulp.task('reload', function(){
	browserSync.reload();
});

gulp.task('serve', ['sass'], function(){
	browserSync({
		server: true
	});
	gulp.watch('*.html', ['reload']);
	gulp.watch('scss/**/*.scss',['sass']);
});

gulp.task('sass', function() {
	return gulp.src('scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 3 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('css'))
		.pipe(browserSync.stream());
});

gulp.task('css', function(){
	return gulp.src('css/**/*.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('js', function(){
	return gulp.src('js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('html', function(){
	return gulp.src('*.html')
		/*.pipe(htmlReplace({
			'css': 'css/style.css',
			'js': 'js/scripts.js',
		});
		.pipe(htmlMin({
			sortAttributes: true,
			sortClassName: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('dist/'));
		*/
});

gulp.task('default', ['serve']);
