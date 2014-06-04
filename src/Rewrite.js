var Rewrite;
(function(){
	Rewrite = {
		process: function(path){
				
			if (_rewrites.hasOwnProperty(path)) {
				return _rewrites[path];
			}
			
			// .reference
			if (path.indexOf('.reference') !== -1) 
				return rewrite_reference(path);
			
			return path;
		}
	};
	
	// import rewrite/reference.js
	
	var _rewrites = {
		'/': 'index.html'
	};
	
}());