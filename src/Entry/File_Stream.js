var File_Stream;
(function(){
	File_Stream = Class({
		Base: File_Static,
		maxAge: 60 * 30,
		
		range_start: null,
		range_end: null,
		
		statsCompleted: function(self, stats, req){
			Range.tryGet(self, stats, req);
			self.resolve(self);
		},
		
		Override: {
			write: function(req, res){
				if (Range.isRange(this)) {
					Range.write(this, req, res);
					return;
				}
				
				res.setHeader('Accept-Ranges', 'bytes');
				this.super(req, res);
			}
		},
		
		writeBody: function(res) {
			__fs.createReadStream(this.path).pipe(res);
		}
	});
	
	
	var Range;
	(function(){
		Range = {
			tryGet: function(file, stats, req) {
				var range = req.headers.range;
				if (range == null) 
					return;
				
				var parts = /bytes=(\d+)-(\d+)?/.exec(range);
				if (parts == null) 
					return;
				var start = +parts[1],
					end = +parts[2];
				
				if (isNaN(start))
					start = 0;
				if (isNaN(end))
					end = stats.size - 1;
					
				if (end > stats.size - 1 || end < start) 
					end = -1;
					
				file.range_start = start;
				file.range_end = end;
			},
			isRange: function(file){
				return file.range_start != null && file.range_end != null;
			},
			write: function(file, req, res){
				if (file.range_end === -1) {
					res.writeHead(416, {
						'Content-Type': 'text/plain'
					});
					res.end('Requested Range Not Satisfiable');
					return;
				}
				
				var start = file.range_start,
					end = file.range_end,
					size = end - start + 1;
				var headers = {
					'Connection': 'keep-alive',
					'Cache-Control': 'public; max-age=' + file.maxAge,
					'Content-Type': file.mimeType,
					'Content-Transfer-Encoding': 'binary',
					'Content-Length': size,
					'Content-Disposition': 'inline; filename=' + file.getFilename() + ';',
					
					'Status': '206 Partial Content',
					'Accept-Ranges': 'bytes',
					'Content-Range': 'bytes ' + start + '-' + end + '/' + size
				};
				if (this.etag != null) 
					headers['ETag'] = this.etag;
				if (this.modified != null) 
					headers['Last-Modified'] = this.modified.toUTCString();
				
				res.writeHead(206, headers);
				
				if (start > 0 && file.mimeType === 'video/x-flv') 
					res.write('FLV' + pack('CCNN', 1, 5, 9, 9));
				
				__fs
					.createReadStream(file.path, {
						flags: 'r',
						start: start,
						end: end
					})
					.pipe(res)
					;
			},
			
		};
		
		// A tiny subset of http://phpjs.org/functions/pack:880
		function pack(format) {
			var result = '',
				args = arguments,
				fromCode = String.fromCharCode,
				imax = arg.length,
				i = 0;
			while ( ++i < imax) {
				if (format[i - 1] === 'N') {
					result += fromCode(args[i] >> 24 & 0xFF);
							+ fromCode(args[i] >> 16 & 0xFF);
							+ fromCode(args[i] >> 8 & 0xFF);
							+ fromCode(args[i] & 0xFF)
							;
					continue;
				} 
				result += fromCode(args[i]);
			}
			return result;
		};
	}())
}())