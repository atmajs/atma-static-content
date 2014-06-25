var entry_get,
	entry_cache_state,
	entry_cache_remove,
	entry_cache_watch
	;
	
(function(){
	entry_get = function(path, req, config){
		
		if (Cache.hasOwnProperty(path)) 
			return Cache[path];
		
		var mimeType = MimeTypes.resolveByPath(path),
			file = File_Static.create(path, mimeType, req, config)
			;
		
		if (CacheEnabled === false) 
			return file;
		
		return (Cache[path] = file);	
	};
	entry_cache_state = function(state){
		if (state === false) 
			Cache = {};
		io.File[
			state && 'enableCache' || 'disableCache'
		]();
		CacheEnabled = state;
	};
	entry_cache_remove = function(path){
		delete Cache[path];
		io.File.clearCache(path);
	};
	entry_cache_watch = function(state){
		CacheWatch = state;
	};
	
	var Cache = {},
		CacheEnabled = true,
		CacheWatch = true;
	
	//import File_Static.js
}());