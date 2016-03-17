'use strict';

var gulp = require('gulp'),
	concat = require('gulp-concat'), // js 병합
	uglify = require('gulp-uglify'), // js  압축
	stripDebug	= require('gulp-strip-debug'),
	webserver= require('gulp-webserver'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	compass = require('gulp-compass'),
	minifyCss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	livereload = require('gulp-livereload'),
	sourcemaps = require('gulp-sourcemaps'),
	converter = require('sass-convert'),

	// 환경설정
	config = require('./config')();


var errorHandler = function (error) {
	console.error(error.message);
	this.emit('end');
};

var plumberOption = {
	errorHandler: errorHandler
}


// 웹서버를 localhost:8000로 실행한다.
gulp.task('server', function(){
 	return gulp.src('./')
 		.pipe(webserver());
});
gulp.task('js-front', function(){
 	return gulp.src('src/js/front.js')
		.pipe(plumber(plumberOption))
 		.pipe(concat('front.min.js')) // 병합
 		.pipe(uglify()) // 압축
 		.pipe(gulp.dest('dist/js'));
});
 // sass 파일을 css로 컴파일 한다.
gulp.task('compass', function(){
	return gulp.src(config.sass.src)
		.pipe(plumber(plumberOption))
  		.pipe(compass({
			sass: config.sass.compassSrc,
			style: 'compressed' //nested, expaned, compact, compressed
		})) 
  		.on('error', function(err) {
	      		// Would like to catch the error here 
		})
  		.pipe(minifyCss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.sass.dist));
});
// 파일 변경 감지 및 브라우저 재시작
gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(config.sass.src, ['compass']);
	gulp.watch('src/js/front.js', ['js-front']);
	gulp.watch(config.sass.dist+'/**').on('change', livereload.changed);
	gulp.watch('dist/js/**').on('change', livereload.changed);
});

// 기본 task 설정
gulp.task('default', [
	'server',
	'compass',
	'js-front',
	 'watch'
]);