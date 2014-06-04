/**
 *	Run with the Atma.Toolkit
 *
 *	``` $ atma```
 **/


module.exports = {
	'settings': {
		io: {
			extensions: {
				js: ['condcomments:read', 'importer:read']
			}
		}
	},
	'add-mimetypes-handler': {
		action: 'custom',
		script: 'tools/MimeTypes.js'
	},
	'import': {
		files: 'builds/**',
		output: 'lib/'
	},
	'jshint': {
		files: ['lib/static.js'],
		jshint: JSHint()
	},
	'uglify': {
		files: 'lib/static.js'
	},

	'watch': {
		files: 'src/**',
		actions: [ 'add-mimetypes-handler', 'import' ]
	},
	
	'publish': {
		action: 'custom',
		script: 'tools/publish'
	},

	'defaults': [
		'add-mimetypes-handler',
		'import',
		'jshint',
		'uglify'
	]
};




function JSHint() {

	return {
		options: {
			curly: false,
			eqeqeq: true,
			forin: false,
			immed: true,
			noarg: true,
			noempty: true,
			nonew: true,
			expr: true,
			regexp: true,
			undef: true,
			strict: true,
			trailing: false,

			boss: true,
			eqnull: true,
			es5: true,
			lastsemic: true,
			browser: true,
			
			onevar: false,
			evil: true,
			sub: true,
			
			smarttabs: true,
			laxcomma  : true,
			laxbreak  : true,
			newcap: false,
			unused: false,

			shadow : true,
			asi: false,
			proto: true,

			node: true,
			latedef: false
			
		},
		globals: {
			define: true,
			require: true,
			ActiveXObject: true,
			Class: true,
			mask: true,
			include: true,
			includeLib: true,
			app: true,
		}
	};
}
