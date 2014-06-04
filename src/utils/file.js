var file_stats,
	file_gzip;
	
(function(){
	file_stats = function(path, cb){
		__fs.stat(path, cb);
	};
	file_gzip = function(content, cb){
		if (_zlib == null) 
			_zlib = require('zlib');
		
		_zlib.gzip(content, function(error, gzip){
			cb(gzip);
		});
	};
	
	var _zlib;
	
}());