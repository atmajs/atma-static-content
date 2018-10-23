var File_Static;
(function(){
	
	File_Static = Utils.class_create(Utils.class_Dfr, {
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
		
		constructor: function(path, mimeType, req){
			this.path = path;
			this.mimeType = mimeType;
			this.getStats(req, this.statsCompleted);
		},
		
		write: function(req, res, settings){
			
			// weak caching
			if (this.etag != null) {
				res.setHeader('ETag', this.etag);
			}
			if (this.modified != null) {
				res.setHeader('Last-Modified', this.modified.toUTCString());
			}
			
			// strong caching
			var maxAge = settings.maxAge == null
				? this.maxAge
				: settings.maxAge;
			if (maxAge != null) {
				res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
			}
			
			// content
			var encoding = this.getEncoding(req),
				length = this.getLength(encoding)
				;
			if (encoding != null) {
                res.setHeader('Content-Encoding', encoding);
                res.setHeader('X-Decompressed-Content-Length', this.getLength(null));
			}
			if (settings.headers != null) {
				res_writeHeaders(res, settings.headers);
			}
			if (this.isNotModified(req)) {
				res.statusCode = 304;
				res.end();
				return;
			}
			MimeTypes.writeHead(res, this.mimeType);
			res.setHeader('Content-Length', length);
			
			if (req.method === 'HEAD') {
				res.end();
				return;
			}
			this.writeBody(res, encoding, settings);
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
			file_stats(this.path, function(error, stat){
				if (error) {
					
					if (error.code === 'ENOENT') {
						var virtual = File
							.getFactory()
							.resolveHandler('file://' + self.path);
						if (virtual != null) {
							
							if (cb)
								return cb(self, {}, req);
							
							self.resolve(self);
						}
					}
					
					self.reject(error);
					return;
				}
				if (stat.isFile() === false) {
					if (stat.isDirectory()) {
						self.reject({ code: 'EISDIR' });
						return;
					}
					self.reject({ code: 'ENOTFILE' });
					return;
				}
				
				self.etag = calcETag(self.path, stat);
				self.modified = stat.mtime;
				self.size = stat.size;
				
				if (cb)
					return cb(self, stat, req);
				
				self.resolve(self);
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
			
			if (this.content == null) 
				return this.size || 0;
			
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
				return this.modified <= Date.parse(utc);
			
			return false;
		}
	});
	
	File_Static.create = function(path, mimeType, req){				
		var Ctor = MimeTypes.isString(mimeType)
			? File_String
			: File_Stream
			;
		return new Ctor(path, mimeType, req);
	};
	
	// import File_String.js
	// import File_Stream.js
	
	var calcETag;
	(function(){
		calcETag = function (path, stat){
			var base64,
				tag = stat.mtime.getTime()
					+ ':'
					+ stat.size
					+ ':'
					+ path
				;
			if (_crypto == null) 
				_crypto = require('crypto');
			
			base64 = _crypto
				.createHash('md5')
				.update(tag, 'utf8')
				.digest('base64');
				
			return 'W/"' + base64 + '"';
		};
		var _crypto;
	}());
	
	
}());