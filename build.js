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
		// 'jshint',
		// 'uglify'
	]
};




function JSHint() {
	
	var options = {
			"bitwise": false,
			"camelcase": false,
			"curly": false,
			"eqeqeq": true,
			"es3": false,
			"forin": false,
			"freeze": false,
			"immed": true,
			"indent": 2,
			"latedef": "nofunc",
			"newcap": false,
			"noarg": true,
			"noempty": true,
			"nonbsp": true,
			"nonew": false,
			"plusplus": false,
			"quotmark": false,
			"undef": true,
			"unused": false,
			"strict": false,
			"trailing": false,
			"maxparams": false,
			"maxdepth": false,
			"maxstatements": false,
			"maxcomplexity": false,
			"maxlen": false,
			"asi": false,
			"boss": true,
			"debug": true,
			"eqnull": true,
			"esnext": true,
			"evil": true,
			"expr": false,
			"funcscope": false,
			"gcl": false,
			"globalstrict": true,
			"iterator": false,
			"lastsemic": true,
			"laxbreak": true,
			"laxcomma": true,
			"loopfunc": false,
			"maxerr": false,
			"moz": false,
			"multistr": true,
			"notypeof": false,
			"proto": true,
			"scripturl": false,
			"smarttabs": true,
			"shadow": true,
			"sub": true,
			"supernew": true,
			"validthis": false,
			"noyield": false,
			"browser": true,
			"couch": false,
			"devel": false,
			"dojo": false,
			"jquery": true,
			"mootools": false,
			"node": true,
			"nonstandard": false,
			"phantom": false,
			"prototypejs": false,
			"rhino": false,
			"worker": false,
			"wsh": false,
			"yui": false,
			"nomen": false,
			"onevar": false,
			"passfail": false,
			"white": false,
			"predef": ["global", "define", "atma", "io", "mask", "include", "ruta", "ruqq", "logger", "app", "UTest", "assert", "eq_", "notEq_", "deepEq_", "notDeepEq_", "has_", "hasNot_"]
		}
	return {
		options: options,
		globals: options.predef
	};
}
