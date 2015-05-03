Http Server static middleware
-----
[![Build Status](https://travis-ci.org/atmajs/atma-static-content.svg?branch=master)](https://travis-ci.org/atmajs/atma-static-content)
[![NPM version](https://badge.fury.io/js/static-content.svg)](http://badge.fury.io/js/static-content)
- Binary/String files _html|scripts|styles|texts|json|.etc_:
	- cache
	- gzip
	- File `read` middlewares. Refer to [atma-io](https://github.com/atmajs/atma-io) for documentation.
	- Virtual files
- Binary streams _images|audio|video|pdf|.etc_:
	- Range requests
	
- Best works with [atma-server](https://github.com/atmajs/atma-server)

#### API
```javascript
require('static-content'):StaticContentMiddleware;

StaticContentMiddleware {
	create: function(settings:StaticContentSettings): function(req, res, next, AppConfig),
	respond: function(req, res, next, AppConfig):null,
	send: ExpressSend,
	Cache: Object {
		status: function(enabled:Boolean)
		remove: function(path:String)
	}
}

StaticContentSettings {
	// Optional, static root folder
	base: String
	
	// Add or overwrite some mimeTypes
	mimeTypes: { MimeTypeString: Array<Extension> }
	extensions: MimeTypeString || Object {
		mimeType: MimeTypeString,
		
		// When utf8 is set, then file will be also cached and gzipped
		encoding: 'UTF-8' || null,
		
		// In seconds
		maxAge: Number
	},
	defaultMimeType: MimeTypeString,
	
	// Optional, set of default Headers
	headers: Object
}
AppConfig {
	// Static root folder resolving:
	// 1) Check `static` property in config
	// 2) Check `base` property in config
	// 3) otherwise, take CWD
	static: String
	base: String
}

ExpressSend = function(req, url, ExpressSettings)
ExpressSend {
	maxage: function(ms:Number): Self,
	pipe: function(res),
	
	// override handlers, support:
	// - `directory`
	// - `error`
	on: function(event:String, function(error:Object))
}

ExpressSettings {
	// base path
	root: String,
	// default `index.html` file
	index: String
}

```

#### Examples
##### NodeJS HTTP
```javascript
require('http')
	.createServer(require('static-content').create({ base: './content' }))
	.listen(5777);
```
##### Atma-Root-Application with ConnectJS
```javascript

atma
	.server
	.Application({
		configs: '/server/configs/*.yml'
	})
	.done(function(app){
		
		var server = connect()
			// dynamic content response
			.use(app.responder({
				// if dynamic endpoint is found from
				// Handlers | RESTful services | Pages
				// middleware pipeline will be run before calling the endpoint
				middleware: [
					connect.query(),
					connect.cookieParser(),
					connect.bodyParser(),
					connect.session({
						// ..
					}),
					passport.initialize(),
					passport.session()
				]
			}))
			// Atma-Server static content middleware
			.use(require('static-content').create({
				base: './public/'
			}))
			.listen(5777);
	});
```
##### Atma-Sub-Application
```javascript
module.exports = atma
	.server
	.Application({})
	.done(function(app){
		app.responders([ 
			// dynamic content response
			app.responder({
				// if dynamic endpoint is found from
				// Handlers | RESTful services | Pages
				// middleware pipeline will be run before calling the endpoint
				middleware: [
					connect.bodyParser(),
					// ...
				]
			}),
			
			// Atma-Server static content middleware
			require('static-content').respond
		]);
	});
```

----
The MIT License