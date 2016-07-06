module.exports = function(grunt) {

	grunt.initConfig({
		'template': {
			'build': {
				'options': {
					// Generate the regular expressions dynamically using Regenerate.
					'data': require('./src/data.js')
				},
				'files': {
					'cssesc.js': ['src/cssesc.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-template');

	grunt.registerTask('default', [
		'template'
	]);

};
