var File_String = Class({
	Base: File_Static,
	
	statsCompleted: function(self){
		
		File
			.readAsync(self.path, { encoding: 'buffer' })
			.pipe(self, 'fail')
			.done(function(content, file){
				self.content = content;
				
				file_gzip(content, function(gzip){
					self.gzip = gzip;
					self.resolve(self);
				});
			});
	}
	
})