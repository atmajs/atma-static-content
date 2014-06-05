
// import dependency.js
// import utils/str.js
// import utils/obj.js
// import utils/file.js
// import utils/path.js
// import utils/res.js
// import utils/send.js
// import utils/responder.js
// import rewrite/reference.js

// import MimeTypes.js
// import Rewrite.js
// import Entry/entry.js

// import interfaces/express_send.js

module.exports = {
	create: createMiddleware,
	respond: createMiddleware(),
	
	send: interface_express_send
}

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
function createMiddleware(settings) {
	var responder = responder_create(settings || {});
	return function(req, res, next, config){
		responder(req, res, config)
			.fail(function(error) {
				if (next != null) {
					next(send_toHttpError(error))
					return;
				}
				send_error(res, error);
			});
	};
}