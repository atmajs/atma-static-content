var File_Stream;
(function(){
	File_Stream = Class({
		Base: File_Static,
		maxAge: 60 * 30,
		
		Override: {
			write: function(req, res, settings){
				var range = Range.tryGet(this, req);
				if (range != null) {
					Range.write(this, range, res, settings);
					return;
				}
				
				res.setHeader('Accept-Ranges', 'bytes');
				this.super(req, res, settings);
			}
		},
		
		writeBody: function(res, encoding, settings) {
			var options = {
				flags: 'r'
			};
			if (settings != null && settings.start != null) {
				var range = Range.toRange(
						settings.start
						, settings.end
						, this.size
					);
				
				if (range[1] >= range[0]) {
					options.start = range[0];
					options.end = range[1];
				}
			}
			var stream = __fs.createReadStream(this.path, options);
			var streamDispose = stream.destroy.bind(stream),
				resDispose = res.destroy.bind(res);
			
			stream
				.on('close', resDispose)
				.on('error', resDispose)
				.pipe(res)
				.on('close', streamDispose)
				.on('error', streamDispose)
				;
		}
	});
	
	
	var Range;
	(function(){
		Range = {
			tryGet: function(file, req) {
				var range = req.headers.range;
				if (range == null) 
					return null;
				
				var ifRange = req.headers['if-range'];
				if (ifRange != null && isModified(ifRange, file)) 
					return null;
				
				var parts = /bytes=(\d+)?-(\d+)?$/.exec(range);
				if (parts == null) 
					return null;
				
				return this.toRange(+parts[1], +parts[2], file.size);
			},
			toRange: function(start, end, size){
				if (isNaN(start)) {
					if (isNaN(end) === false) {
						start = size - end;
						end = size - 1;
					}else {
						start = 0;
					}
				}
				if (isNaN(end))
					end = size - 1;
				if (end > size - 1) {
					//- end = -1; not an error, adjust range:
					end = size - 1;
				}
				if (end < start) 
					end = -1;
				return [start, end];
			},
			write: function(file, range, res){
				if (range[1] === -1) {
					res.writeHead(416, {
						'Content-Type': 'text/plain',
						'Content-Range': 'bytes */' + file.size
					});
					res.end('Requested Range Not Satisfiable');
					return;
				}
				
				
				var start = range[0],
					end = range[1];
				
				var size = end - start + 1,
					headers = {
					'Connection': 'keep-alive',
					'Cache-Control': 'public; max-age=' + file.maxAge,
					'Content-Type': file.mimeType,
					'Content-Transfer-Encoding': 'binary',
					'Content-Length': size,
					'Content-Disposition': 'inline; filename=' + file.getFilename() + ';',
					'Status': '206 Partial Content',
					'Accept-Ranges': 'bytes',
					'Content-Range': 'bytes ' + start + '-' + end + '/' + file.size
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
		
		function isModified(mix, file) {
			
			var isETag = mix.indexOf('"') !== -1;
			if (isETag && file.etag != null) 
				return file.etag.indexOf(mix) === -1;
			
			if (!isETag && file.modified != null) {
				return Date.parse(file.modified) > Date.parse(mix);
			}
			return true;
		}
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