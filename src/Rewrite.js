var Rewrite;
(function(){
	Rewrite = {
		process: function(path, config){
			if (_rewrites.hasOwnProperty(path)) 
				return _rewrites[path];
			
			if (path.charCodeAt(path.length - 1) === 47) {
				// /
				path += config && config.index || 'index.html';
			}
			
			
			// .reference
			if (path.indexOf('.reference') !== -1) 
				return rewrite_reference(path);
			
			return path;
		}
	};
	
	// import rewrite/reference.js
	
	var _rewrites = {};
	
}());