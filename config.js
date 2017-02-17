var root = __dirname,
	source = 'src',
	dest = 'dist',
	guide ='guide';

module.exports = {
	'root': root,
	'source': root + source,
	'guide': root + guide,
	'dest': root + dest,
		
	'html': {
		'src': source + '/html/**/*.html',
		'base': source + '/html',
		'dest': dest+ '/html',
		'guide': source + '/html/guide',
		'guideDest': guide + '/html'
	},

	'sass': {
		'src' : source + '/scss/**/*.scss',
		'base': source + '/scss',
		'dest': dest + '/css'
	},
	'sass_sourcemaps': './maps',	

	'js': {
		'src': source + '/js',
		'dest': dest + '/js',
		'uiCmd': source + '/js/ui_common.js',
		'plugins': source + '/js/plugins/*.js',
		'polyfills': source + '/js/polyfills/*.js'
	},
	'ftp': {
		'dest': dest,
		'guide': guide,
		'remote': '/Test/lotto/',
		'host': '69.195.124.142',
		'port':21,
		'user': 'code@singihae.com',
		'pass': 'codeftp1234'
	}
};