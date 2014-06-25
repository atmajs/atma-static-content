var responder_create;

(function(){
	responder_create = function(settings){
		
		if (settings.mimeTypes) 
			MimeTypes.registerMimeTypes(settings.mimeTypes);
		
		if (settings.extensions) 
			MimeTypes.registerExtensions(settings.extensions);
			
		if (settings.defaultMimeType) 
			MimeTypes.setDefault(settings.defaultMimeType);
		
		return function(req, res, appConfig){
			var dfr = new Class.Deferred;
			
			if (res.writable === false || res.finished === true) {
				return reject(Error('Stream is not writable'));
			}
			if (send_headersWritable(res) === false) 
				return reject(Error("Can't set headers after they are sent."));
			
			var mix = path_fromUrl(req.url, appConfig, settings);
			if (typeof mix === 'number') 
				return reject({ code: mix });
			
			var path = mix;
			
			entry_get(path, req)
				.done(function(entry){
					entry.write(req, res, settings);
					dfr.resolve();
				})
				.fail(function(error){
					if (error.code === 'EISDIR') {
						rejectDirectory(error);
						return;
					}
					reject(error);
				})
				;
			
			function rejectDirectory(error){
				if (settings.handleDirectory) {
					path = path_toDir(req.url);
					if (path != null) {
						// /
						send_redirect(res, path);
						dfr.resolve();
						return;
					}
					reject(403);
					return;
				}
				reject(error);
			}
			function reject(error) {
				if (settings.handleErrors) {
					send_error(res, error);
					return dfr.resolve();
				}
				return dfr.reject(error);
			}
			return dfr;
		};
	};
}());