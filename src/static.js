
// import dependency.js
// import utils/file.js
// import utils/path.js
// import rewrite/reference.js

// import MimeTypes.js
// import Rewrite.js
// import Entry/entry.js

module.exports = {
	/*
	 * staticContentSettings {
		mimeTypes: { mimeType: extensions }
		extensions: {
			extension: mimeTypeString || {
				mimeType: string
				encoding: string
				cacheControl: Number
				maxAge: Number
			}
		},
		defaultMimeType: string
	 }
	 */
	create: function(settings){
		if (settings.mimeTypes) 
			MimeTypes.registerMimeTypes(settings.mimeTypes);
		
		if (settings.extensions) 
			MimeTypes.registerExtensions(settings.extensions);
			
		if (settings.defaultMimeType) 
			MimeTypes.setDefault(settings.defaultMimeType);
		
		return this.respond;
	},
	respond: function(req, res, next, config){
			
		var path = path_fromUrl(req.url, config),
			entry = entry_get(path, req, config);
			
		entry
			.done(function(entry){
				entry.write(req, res);
			})
			.fail(function(error){
				if (next != null) 
					return next();
				
				notProcessed(res, error);
			});
	}
}

function notProcessed(res, error) {
	res.writeHead(404, {
		'Content-Type': 'text/plain'
	});
	res.end('Not processed: ' + error);
}
