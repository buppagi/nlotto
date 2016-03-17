module.exports = function() {
	var source = 'src',
		dist = 'dist',
		build = 'build',
		remove = [],
		
		sass = {
			src : source + '/scss/**/*.{scss,sass}',
			compassSrc : source + '/scss',
			dist : dist + '/css'
		};
	return {
		del : remove,
		src : source,
		css : dist,
		sass : sass
	}
};