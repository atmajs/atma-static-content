var path_fromUrl;
(function(){
	
	path_fromUrl = function(url, config){
		var path = url,
			base = _cwd,
			query = url.indexOf('?');
		if (query !== -1) 
			path = url.replace(0, query);
			
		path = Rewrite.process(path);
		
		if (config != null){
			if (config.static != null) 
				base = config.static;
			else if (config.base != null) 
				base = config.base;
		}
		
		return _Uri.combine(base, path);
	};
	var _Uri = net.Uri,
		_cwd = process.cwd()
		;
}());