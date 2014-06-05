var path_fromUrl,
	path_toDir;
(function(){
	
	path_fromUrl = function(url, appConfig, settings){
		var path = url,
			base = null,
			query = url.indexOf('?');
		if (query !== -1) 
			path = url.replace(0, query);
			
		path = decode(path);
		if (path == null) 
			return 400;
		
		if (path.indexOf('\0') !== -1) 
			return 400;
		
		path = normalize(path);
		path = collapse(path);
		if (path == null) 
			return 403;
		
		path = Rewrite.process(path, appConfig);
		base = getBase(appConfig, settings);
		logger.log('getPath:'.green, base, path);
		return _Uri.combine(base, path);
	};
	path_toDir = function(url){
		var path = url,
			query = url.indexOf('?');
		if (query !== -1) 
			path = url.replace(0, query);
		
		if (path.charCodeAt(path.length - 1) === 47) {
			// / <is directory>
			return null
		}
		return path + '/';
	};
	var _Uri = net.Uri,
		_cwd = normalize(process.cwd()),
		_subFolder = /([^\/]+\/)?\.\.\//
		;
		
	function decode(path) {
		if (path == null) 
			return null;
		
		if (path.indexOf('%') === -1 && path.indexOf('+') === -1) 
			return path;
		
		try {
			return decodeURIComponent(path)
		} catch(error){
			return null;
		}
	}
	function normalize(path) {
		return path
			.replace(/\\/g, '/')
			.replace(/^\.\//, '')
			.replace(/\/\.\//g, '/')
			.replace(/\/{2,}/g, '/')
			;
	}
	function collapse(path) {
		if (path == null) 
			return null;
		var errored = false;
		while (errored === false && path.indexOf('../') !== -1) {
			path = path.replace(_subFolder, replace);
		}
		function replace(full, segment) {
			if (!segment) 
				errored = true;
			return '';
		}
		
		return errored === false
			? path
			: null
			;
	}
	
	var getBase;
	(function(){
		getBase = function (appConfig, settings){
			var base = findBase(appConfig, settings);
			if (base == null) 
				return _cwd;
			
			if (base.substring(0, 5) === 'file:') 
				return base.replace('file://', '');
			
			return normalize(_Uri.combine(_cwd, base));
		};
		
		function findBase(appConfig, settings) {
			if (appConfig != null){
				if (appConfig.static != null) 
					return appConfig.static;
				if (appConfig.base != null) 
					return appConfig.base;
			}
			if (settings != null) {
				if (settings.base != null) 
					return settings.base;
			}
			return null;
		}
	}());
	
}());