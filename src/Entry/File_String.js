var File_String;
(function(){
	File_String = Utils.class_create(File_Static, {
		
		statsCompleted: function(self, stats){
			
			File
				.readAsync('file://' + self.path, { encoding: 'buffer' })
				.pipe(self, 'fail')
				.done(function(content, file){
					__eventStream.trigger('file', file || self);
					
					if (content != null
						&& typeof content === 'object'
						&& Buffer.isBuffer(content) === false) {
						
						content = serialize(content);
					}
					
					self.content = content;
					
					if (content.length < 100) {
						self.resolve(self);
						return;
					}
					
					file_gzip(content, function(gzip){
						if (gzip != null && gzip.length < stats.size) 
							self.gzip = gzip;
						
						self.resolve(self);
					});
				});
		}
	});
	
	function serialize(obj){
		try {
			return JSON.stringify(obj);
		} catch(error) {
			return error.message;
		}
	}
	var _obj_toString = Object.prototype.toString;
}());