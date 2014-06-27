var File_String;
(function(){
	File_String = Class({
		Base: File_Static,
		
		statsCompleted: function(self, stats){
			
			File
				.readAsync('file://' + self.path, { encoding: 'buffer' })
				.pipe(self, 'fail')
				.done(function(content, file){
					__eventStream.trigger('file', file || self);
					
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
	
}());