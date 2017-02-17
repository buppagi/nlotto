'use strict';

var gulp = require('gulp'),
	util 	= require('gulp-util'),
	concat = require('gulp-concat'), // js 병합
	uglify = require('gulp-uglify'), // js  압축
	stripDebug	= require('gulp-strip-debug'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	livereload = require('gulp-livereload'),
	sourcemaps = require('gulp-sourcemaps'),
	converter = require('sass-convert'),
	ftp = require('gulp-ftp'),
	mq = require('gulp-combine-mq'),
	include = require('gulp-html-tag-include'),
	w3cjs = require('gulp-w3cjs'),
	bs = require('browser-sync').create('modetour'),
	reload = bs.reload;


// 환경설정
var config = require('./config');

var errorHandler = function (error) {
	console.error(error.message);
	this.emit('end');
};

var plumberOption = {
	errorHandler: errorHandler
}
gulp.task('serve', function() {
	bs.init({
		server: {
			baseDir: "./"
		},
		port:9000,
		ui: false,
		notify:false
	});
});
gulp.task('plugins_js', function(){
 	return gulp.src( config.js.plugins )
 		.pipe( sourcemaps.init() )
		.pipe( plumber(plumberOption))
 		.pipe( uglify( {preserveComments: 'license'} ) ) // 압축
 		.pipe(concat('plugins.min.js')) // 병합
 		.pipe(sourcemaps.write('maps'))
 		.pipe(gulp.dest( config.js.dest + '/libs' ))
 		.pipe( reload({stream: true}) );
});
gulp.task('js-front', function(){
 	return gulp.src( config.js.src + '/front.js' )
		.pipe(plumber(plumberOption))
 		.pipe(uglify()) // 압축
 		.pipe(concat('front.min.js')) // 병합
 		.pipe(sourcemaps.write('maps'))
 		.pipe(gulp.dest( config.js.dest ) )
 		.pipe( reload({stream: true}) );
});
gulp.task('basic_sass', function(){
 	return gulp.src( config.sass.base + '/style.scss' )
 		.pipe( sourcemaps.init() )
		.pipe( sass( config.sass.options ).on('error', sass.logError) )
		.pipe( mq() )
		.pipe(minifyCss())
		.pipe( rename({suffix: '.min'}) )
		.pipe(sourcemaps.write( config.sass_sourcemaps ))
		.pipe(gulp.dest( config.sass.dest ))
		.pipe( reload({stream: true}) );
});
/* FTP Upload */
gulp.task('ftp_dist', function(){
	return gulp.src( config.ftp.dest + '/**/*.*' )
		.pipe(ftp({
			host: config.ftp.host,
			port: config.ftp.port,
			user: config.ftp.user,
			pass: config.ftp.pass,
			remotePath: config.ftp.remote + 'dist/'
		}))
		.pipe(util.noop());
});
// 파일 변경 감지 및 브라우저 재시작
gulp.task('watch', function() {
	gulp.watch( [config.sass.base + '/style.scss', config.sass.src], ['basic_sass'] );
	gulp.watch( config.js.src + '/front.js', ['js-front'] );
	gulp.watch( config.js.plugins, ['plugins_js'] );
	gulp.watch( config.ftp.dest + '/**/*.*', ['ftp_dist'] );

	gulp.watch('./dist/**/*.html').on('change', reload);
	gulp.watch('./dist/**/*.css').on('change', reload);
	gulp.watch('./dist/**/*.js').on('change', reload);
});

// 기본 task 설정
gulp.task('default', [
	'serve',
	'basic_sass',
	'plugins_js',
	'js-front',
	'ftp_dist',
	 'watch'
]);