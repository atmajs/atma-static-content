var File_Static;
(function(){
	
	File_Static = Class({
		Base: Class.Deferred,
		path: null,
		mimeType: null,
		modified: null,
		etag: null,
		maxAge: 60,
		size: null,
		/*
		 * Is implemented only in File_String
		 */
		gzip: null,
		content: null,
		
		Construct: function(path, mimeType, req, config){
			this.path = path;
			this.mimeType = mimeType;
			this.getStats(req, this.statsCompleted);
		},
		
		Static: {
			create: function(path, mimeType, req, config){
				
				var Ctor = MimeTypes.isString(mimeType)
					? File_String
					: File_Stream
					;
				return new Ctor(path, mimeType, req, config);
			}
		},
		
		write: function(req, res){
			MimeTypes.writeHead(res, this.mimeType);
			
			// weak caching
			if (this.etag != null) 
				res.setHeader('ETag', this.etag)
			if (this.modified != null) 
				res.setHeader('Last-Modified', this.modified.toUTCString());
			
			
			// string caching
			if (this.maxAge != null) 
				res.setHeader('Cache-Control', 'public, max-age:' + this.maxAge);
			
			// content
			var encoding = this.getEncoding(req),
				length = this.getLength(encoding)
				;
			if (encoding != null) 
				res.setHeader('Content-Encoding', encoding);
				
			res.setHeader('Content-Length', length);
			
			if (this.isNotModified(req)) {
				res.statusCode = 304;
				res.end();
				return;
			}
			
			if (req.method === 'HEAD') {
				res.end();
				return;
			}
			this.writeBody(res, encoding)
		},
		writeBody: function(res, encoding){
			
			var data = encoding === 'gzip'
				? this.gzip
				: this.content
				;
			res.end(data);
		},
		
		getStats: function(req, cb){
			var self = this;
			file_stats(this.path, function(error, stats){
				if (error) {
					self.reject(error);
					return;
				}
				if (stats.isFile() === false) {
					if (stats.isDirectory()) {
						self.reject('Directory');
						return;
					}
					self.reject('Not a file');
					return;
				}
				
				self.modified = stats.mtime;
				self.size = stats.size;
				cb(self, stats, req);
			});
		},
		getFilename: function(){
			var slash = this.path.lastIndexOf('/');
			return slash === -1
				? this.path
				: this.path.substring(slash + 1)
				;
		},
		getEncoding: function(req){
			if (this.gzip == null) 
				return null;
			
			var accept = req.headers['accept-encoding'];
			return accept && /\bgzip\b/.test(accept)
				? 'gzip'
				: null
				;
		},
		getLength: function(encoding){
			if (encoding === 'gzip') 
				return this.gzip.length;
			
			if (this.size != null) 
				return this.size;
			
			if (typeof this.content === 'string') 
				return Buffer.byteLength(this.content, 'utf8');
			
			// assume Buffer or BufferLike content
			return this.content.length;
		},
		isNotModified: function(req) {
			var etag = req.headers['if-none-match'],
				utc = req.headers['if-modified-since'];
			
			if (this.etag != null && etag) 
				return this.etag === etag;
			
			if (this.modified != null && utc) 
				return this.modified <= new Date(utc);
			
			return false;
		}
	});
	
	// import File_String.js
	// import File_Stream.js
	
}());