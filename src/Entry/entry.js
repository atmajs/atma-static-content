var entry_get,
	entry_cache_has,
	entry_cache_clear
	;
	
(function(){
	entry_get = function(path, req, config){
		
		if (Cache.hasOwnProperty(path)) 
			return Cache[path]
		
		var mimeType = MimeTypes.resolveByPath(path),
			file = File_Static.create(path, mimeType, req, config)
			;
		
		return (Cache[path] = file);	
	};
	
	var Cache = {};
	
	//import File_Static.js
}());