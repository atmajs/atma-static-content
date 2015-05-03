
// import dependency.js
// import utils/str.js
// import utils/obj.js
// import utils/file.js
// import utils/res.js

// import MimeTypes.js
// import Rewrite.js
// import Entry/entry.js

// import utils/path.js
// import utils/send.js
// import utils/responder.js



// import interfaces/express_send.js

module.exports = {
	create: createMiddleware,
	respond: createMiddleware(),
	
	send: interface_express_send,
	
	Cache: {
		state: entry_cache_state,
		remove: entry_cache_remove
	},
	
	on:  __eventStream.on.bind(__eventStream),
	off: __eventStream.off.bind(__eventStream),
	
	utils: {
		/* (url, config, ?settings) */
		resolvePath: path_fromUrl
	}
};

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
   defaultMimeType: string,
   
   // do not send errors on 404, but continue the middleware pipeline
   silentNotFound: Boolean
 }
*/
function createMiddleware(settings) {
	settings = settings || {};
	var responder = responder_create(settings);
	return function(req, res, next){
		// make it connectjs middleware compatible
		var config = arguments.length > 3
			? arguments[3]
			: null;
			
		responder(req, res, config)
			.fail(function(error) {
				if (next != null) {
					error = send_toHttpError(error);
					if (error.code === 404 && settings.silentNotFound !== false) 
						error = null;
					
					next(error);
					return;
				}
				send_error(res, error);
			});
	};
}